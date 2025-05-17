package com.gs.authentificationservice.Dto;

import com.gs.authentificationservice.TypeRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDto {
    private  long id;
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @Email
    private String email;

    private TypeRole role;
    private boolean enabled;
}
