package backend.app.loan.repository;

import backend.app.loan.enums.LoanStatus;
import backend.app.loan.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface LoanRepo extends JpaRepository<Loan, Long> {
    List<Loan> findByStatus(LoanStatus status);
    List<Loan> findByUser_UserId(Long userId);
}
