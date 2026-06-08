package backend.loan.dto;


public record LoanRequestDTO(
        Long userId,
        Long assetId
) {}
