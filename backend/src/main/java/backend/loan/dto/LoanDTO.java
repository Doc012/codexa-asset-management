package backend.loan.dto;

import backend.loan.enums.LoanStatus;

import java.util.Date;

public class LoanDTO {
    public record loanRequest(

            Date loanDate,
            Date dueDate,
            Date returnedDate,
            LoanStatus status
    ){}
}