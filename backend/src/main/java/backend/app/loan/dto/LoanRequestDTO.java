package backend.app.loan.dto;

public record LoanRequestDTO(
        Long userId,
        Long assetId
) {}
