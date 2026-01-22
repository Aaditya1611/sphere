package com.chatapp.web;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {

        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/topic/**").permitAll()
                        .requestMatchers("/queue/**").permitAll()
                        .requestMatchers("/app/**").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers("/signup").permitAll()
                        .requestMatchers("/searchFriend/**").permitAll()
                        .requestMatchers("/savebio").permitAll()
                        .requestMatchers("/deleteaccount/**").permitAll()
                        .requestMatchers("/savename").permitAll()
                        .requestMatchers("/login").permitAll()
                        .requestMatchers("/user/chats/**").permitAll()
                        .requestMatchers("/getFriends/**").permitAll()
                        .requestMatchers("/getBlockedUsers/**").permitAll()
                        .requestMatchers("/addFriend").permitAll()
                        .requestMatchers("/blockUser").permitAll()
                        .requestMatchers("/unblockUser").permitAll()
                        .requestMatchers("/profile/**").permitAll()
                        .requestMatchers("/sendOtp").permitAll()
                        .requestMatchers("/verifyOtp").permitAll()
                        .requestMatchers("/userFriends/**").permitAll()
                        .requestMatchers("/userBlockedFriends/**").permitAll()
                        .requestMatchers("/userChats/**").permitAll()
                        .requestMatchers("/uploadMediaFiles/**").permitAll()
                        .requestMatchers("/getMediaFiles/**").permitAll()
                        .requestMatchers("/uploadProfilePic/**").permitAll()
                        .requestMatchers("/updateProfilePicUrl").permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
