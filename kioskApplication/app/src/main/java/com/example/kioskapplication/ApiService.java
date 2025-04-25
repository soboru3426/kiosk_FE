// app/src/main/java/com/example/kioskapplication/ApiService.java
package com.example.kioskapplication;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface ApiService {
    @Headers("Content-Type: application/json")
    @POST("/api/receive-token")
    Call<Void> sendFCMToken(@Body TokenRequest tokenRequest);
}
