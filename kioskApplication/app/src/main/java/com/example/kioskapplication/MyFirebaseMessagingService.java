// app/src/main/java/com/example/kioskapplication/MyFirebaseMessagingService.java
package com.example.kioskapplication;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "MyFirebaseMsgService";
    private static final String CHANNEL_ID = "kiosk_channel";
    private static final long DEFAULT_USER_ID = 5L;

    @Override
    public void onMessageReceived(RemoteMessage msg) {
        Log.d(TAG, "From: " + msg.getFrom());
        if (!msg.getData().isEmpty()) {
            Log.d(TAG, "Data payload: " + msg.getData());
        }
        if (msg.getNotification() != null) {
            String t = msg.getNotification().getTitle();
            String b = msg.getNotification().getBody();
            showNotification(t, b);
        }
    }

    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "New token: " + token);
        sendRegistrationToServer(DEFAULT_USER_ID, token);
    }

    private void sendRegistrationToServer(long userId, String token) {
        TokenRequest req = new TokenRequest(userId, token);
        ApiClient.getRetrofitInstance()
                .create(ApiService.class)
                .sendFCMToken(req)
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> r) {
                        Log.d(TAG, "HTTP code: " + r.code());
                        if (r.isSuccessful()) Log.d(TAG, "Token sent");
                        else Log.w(TAG, "Send failed: " + r.code());
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Log.e(TAG, "Send error", t);
                    }
                });
    }

    @SuppressLint("MissingPermission")
    private void showNotification(String title, String msg) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            int p = ContextCompat.checkSelfPermission(
                    this, Manifest.permission.POST_NOTIFICATIONS
            );
            if (p != PackageManager.PERMISSION_GRANTED) {
                Log.w(TAG, "No notification permission");
                return;
            }
        }

        createNotificationChannel();

        Intent i = new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(
                this, (int)System.currentTimeMillis(),
                i, PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder b = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(getApplicationInfo().icon)
                .setContentTitle(title != null ? title : getString(R.string.app_name))
                .setContentText(msg)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pi)
                .setAutoCancel(true);

        try {
            NotificationManagerCompat.from(this)
                    .notify((int)System.currentTimeMillis(), b.build());
        } catch (SecurityException e) {
            Log.e(TAG, "notify failed", e);
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationChannel c = new NotificationChannel(
                CHANNEL_ID,
                getString(R.string.channel_name),
                NotificationManager.IMPORTANCE_HIGH
        );
        c.setDescription(getString(R.string.channel_description));
        NotificationManager m = getSystemService(NotificationManager.class);
        if (m != null) m.createNotificationChannel(c);
    }
}
