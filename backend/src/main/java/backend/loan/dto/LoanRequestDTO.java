package backend.loan.dto;


import java.time.LocalDate;

public record LoanRequestDTO(
        Long userId,
        Long assetId
) {}
