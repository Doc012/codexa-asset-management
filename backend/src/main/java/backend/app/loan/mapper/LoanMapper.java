package backend.app.loan.mapper;

import backend.app.loan.dto.LoanResponseDTO;
import backend.app.loan.model.Loan;

public class LoanMapper {

    public static LoanResponseDTO toDTO(Loan loan) {

        return new LoanResponseDTO(
                loan.getLoanId(),
                loan.getUser().getUserId(),
                loan.getAsset().getAssetId(),
                loan.getStatus(),
                loan.getRequestDate(),
                loan.getCheckoutDate(),
                loan.getDueDate()
        );
    }
}