package backend.Loan.repository;

import backend.Loan.enums.LoanStatus;
import backend.Loan.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface LoanRepo extends JpaRepository<Loan, Long> {
    List<Loan> findByStatus(LoanStatus status);
}
