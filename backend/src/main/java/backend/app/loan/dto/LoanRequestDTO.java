package backend.app.loan.dto;


import java.time.LocalDate;

public record LoanRequestDTO(
        Long userId,
        Long assetId,
        LocalDate checkoutDate,
        LocalDate dueDate
) {}
