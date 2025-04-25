// app/src/main/java/com/example/kioskapplication/ApiClient.java
package com.example.kioskapplication;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Retrofit 인스턴스를 생성하는 클래스입니다.
 * BuildConfig 대신 명시적으로 BASE_URL을 지정하도록 변경했습니다.
 */
public class ApiClient {
    // 에뮬레이터에서 로컬 Spring Boot 서버에 접속할 때 사용하는 URL
    //private static final String BASE_URL = "http://tomhoon.duckdns.org:9999/";
    private static final String BASE_URL = "http://tomhoon.duckdns.org:8883/";
    //private static final String BASE_URL = "http://192.168.0.37:8080/";
    private static Retrofit retrofit;

    public static Retrofit getRetrofitInstance() {
        if (retrofit == null) {
            // 요청/응답 로그 확인용 인터셉터
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(logging)
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
