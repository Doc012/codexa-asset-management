package backend.loan.mapper;

import backend.loan.dto.LoanResponseDTO;
import backend.loan.model.Loan;

public class LoanMapper {

    public static LoanResponseDTO toDTO(Loan loan) {

        return new LoanResponseDTO(
                loan.getLoanId(),
                loan.getUser().getUserId(),
                loan.getAsset().getAssetId(),
                loan.getAsset().getTitle(),
                loan.getAsset().getCategory().name(),
                loan.getStatus(),
                loan.getRequestDate(),
                loan.getCheckoutDate(),
                loan.getDueDate()
        );
    }
}