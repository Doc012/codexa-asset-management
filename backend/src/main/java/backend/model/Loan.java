package backend.model;

import backend.enums.LoanStatus;
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
    private Long loanId;

    // MANY loans belong to ONE user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // MANY loans belong to ONE asset
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