package com.example.kioskapplication;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.google.firebase.messaging.FirebaseMessaging;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivityFCM";
    private static final long DEFAULT_USER_ID = 5L;

    // 화면에 FCM 토큰을 표시할 TextView
    private TextView tvFcmToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d(TAG, "onCreate() 호출됨");
        // TextView 초기화
        tvFcmToken = findViewById(R.id.tvFcmToken);

        // Android 13 이상은 알림 권한 체크
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityResultLauncher<String> permissionLauncher =
                    registerForActivityResult(
                            new ActivityResultContracts.RequestPermission(),
                            granted -> {
                                Log.d(TAG, "권한 요청 결과: " + granted);
                                // 권한 여부와 상관없이 토큰 갱신 시도
                                fetchAndDisplayToken();
                            }
                    );

            if (ContextCompat.checkSelfPermission(
                    this, Manifest.permission.POST_NOTIFICATIONS
            ) != PackageManager.PERMISSION_GRANTED) {
                permissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS);
            } else {
                fetchAndDisplayToken();
            }
        } else {
            // Android 13 미만
            fetchAndDisplayToken();
        }
    }

    /**
     * FCM 토큰을 발급받아, 화면에 표시하고 서버로 전송합니다.
     */
    private void fetchAndDisplayToken() {
        Log.d(TAG, "fetchAndDisplayToken() 호출됨");
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    Log.d(TAG, "토큰 발급 완료 콜백, 성공? " + task.isSuccessful());
                    if (!task.isSuccessful()) {
                        Log.e(TAG, "FCM 토큰 가져오기 실패", task.getException());
                        return;
                    }
                    String token = task.getResult();
                    Log.d(TAG, "발급된 FCM 토큰: " + token);

                    // 화면에 토큰 표시
                    tvFcmToken.setText(token);

                    // 이전에 저장된 토큰과 비교
                    String last = getSharedPreferences("prefs", MODE_PRIVATE)
                            .getString("fcm_token", null);
                    if (token != null && !token.equals(last)) {
                        Log.d(TAG, "토큰 변경됨 (이전=" + last + "), 서버로 전송");
                        sendTokenToServer(token);
                        getSharedPreferences("prefs", MODE_PRIVATE)
                                .edit()
                                .putString("fcm_token", token)
                                .apply();
                    } else {
                        Log.d(TAG, "토큰 미변경, 전송 생략");
                    }
                });
    }

    /**
     * 변경된 FCM 토큰을 서버로 전송하고 결과를 로그에 남깁니다.
     */
    private void sendTokenToServer(String token) {
        Log.d(TAG, "sendTokenToServer() 호출됨, token=" + token);  // ✅ [전송 시도 로그]

        TokenRequest req = new TokenRequest(DEFAULT_USER_ID, token);
        ApiService svc = ApiClient.getRetrofitInstance().create(ApiService.class);
        svc.sendFCMToken(req).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> resp) {
                Log.d(TAG, "토큰 전송 HTTP 응답 코드: " + resp.code());  // ✅ [HTTP 응답 코드 로그]
                if (resp.isSuccessful()) {
                    Log.d(TAG, "✅ FCM 토큰 전송 성공");
                } else {
                    Log.w(TAG, "⚠️ FCM 토큰 전송 실패 (응답은 옴)");
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e(TAG, "❌ FCM 토큰 전송 중 네트워크 에러 발생", t);  // ✅ [전송 실패 로그]
            }
        });
    }
}
