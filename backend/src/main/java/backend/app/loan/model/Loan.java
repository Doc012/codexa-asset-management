package backend.app.loan.model;

import backend.app.asset.model.Asset;
import backend.app.loan.enums.LoanStatus;
import backend.app.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "loans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long loanId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    private LocalDate requestDate;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    private LocalDate checkoutDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
}