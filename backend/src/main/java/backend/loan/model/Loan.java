package backend.loan.model;

import backend.asset.model.Asset;
import backend.loan.enums.LoanStatus;
import backend.user.model.User;
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

    // Primary Key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanId;

    // Many loans belong to One user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many loans belong to One asset
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