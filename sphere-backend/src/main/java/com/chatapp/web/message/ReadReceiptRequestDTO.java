package com.chatapp.web.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReadReceiptRequestDTO {

    private Long senderId;
    private Long recipientId;
    private String recipientName;  // The firstname of the original sender (who we're sending the receipt back to)
}
