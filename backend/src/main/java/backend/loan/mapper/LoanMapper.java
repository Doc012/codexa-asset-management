package backend.loan.mapper;

import backend.asset.model.Asset;
import backend.asset.repository.AssetRepo;
import backend.loan.dto.LoanResponseDTO;
import backend.loan.model.Loan;
import backend.user.model.User;
import backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Component
public class LoanMapper {

    private final  UserRepository userRepo;
    private final AssetRepo assetRepo;

    public LoanResponseDTO toDTO(Loan loan) {

        User user = userRepo.findById(loan.getUser().getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        Asset asset = assetRepo.findById(loan.getAsset().getAssetId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Asset not found."
                ));

        return new LoanResponseDTO(
                loan.getLoanId(),
                loan.getUser().getUserId(),
                asset.getAssetId(),
                asset.getTitle(),
                asset.getCategory(),
                user.getEmail(),
                user.getDepartment(),
                loan.getStatus(),
                loan.getRequestDate(),
                loan.getCheckoutDate(),
                loan.getDueDate()


        );
    }
}