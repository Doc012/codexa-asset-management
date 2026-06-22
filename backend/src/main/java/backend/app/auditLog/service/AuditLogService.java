package backend.app.auditLog.service;

import backend.app.asset.model.Asset;
import backend.app.asset.repository.AssetRepo;
import backend.app.asset.service.AssetService;
import backend.app.auditLog.dto.AuditLogDTO;
import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.model.AuditLog;
import backend.app.auditLog.repository.AuditLogRepo;
import backend.app.loan.model.Loan;
import backend.app.loan.repository.LoanRepo;
import backend.app.loan.service.LoanService;
import backend.app.user.enums.Role;
import backend.app.user.model.User;
import backend.app.user.repository.UserRepository;
import backend.app.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepo repository;
    private final UserRepository userRepository;
    private final LoanRepo loanRepo;
    private final AssetRepo assetRepo;

    /**
     *
     * @param id
     * @return
     */
    public AuditLog getAuditLogById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Audit Log Not Found With ID: " + id
                ));
    }

    /**
     *
     * @return
     */
    public List<AuditLog> getAllAuditLogs(){
        List<AuditLog> logs = repository.findAll();
        Collections.reverse(logs);
        return logs;
    }

    public AuditLog createLog(AuditLog log){
        AuditLog newLog = AuditLog.builder()
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .userId(log.getUserId())
                .actionType(log.getActionType())
                .timestamp(LocalDateTime.now())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .message(log.getMessage())
                .build();

        return repository.save(newLog);
    }

    public List<AuditLog> getAuditLogsByUserId(Long userId){
        List<AuditLog> logs = repository.findByUserId(userId);
        Collections.reverse(logs);
        return logs;
    }

    public List<AuditLog> getAuditLogsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return repository.findByUserId(user.getUserId());
    }

    public List<AuditLog> getAuditLogsByActionType(ActionType actionType){
        return repository.findByActionType(actionType);
    }

    public List<AuditLog> getAuditLogsByEntityType(EntityType entityType){
        return repository.findByEntityType(entityType);
    }

    public List<AuditLogDTO.managerLogResponse> managerLog(Long id){

        return repository.findByUserId(id).stream()
                .filter(log -> log.getEntityType().equals(EntityType.LOAN))
                .map(log -> {
                    User user = userRepository.findById(id)
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "User not found"
                            ));

                    if (user.getRole().equals(Role.MANAGER)){
                        return new AuditLogDTO.managerLogResponse(
                                log.getLogId(),
                                userRepository.findById(log.getUserId())
                                        .map(User::getEmail)
                                        .orElse("Unknown user"),
                                entityTitle(log.getEntityType(), log.getEntityId()),
                                log.getEntityType(),
                                log.getActionType(),
                                LocalDateTime.now(),
                                log.getOldValue(),
                                log.getNewValue(),
                                log.getMessage()
                        );
                    } else {
                        throw new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "Not authorized"
                        );
                    }
                }
                )
                .toList();

    }

    public <T> T entityTitle(EntityType entityType, Long id){
        if (entityType.equals(EntityType.LOAN)){
            return (T) loanRepo.findById(id)
                    .map(Loan::getAsset)
                    .map(Asset::getTitle)
                    .orElse("Unknown loan asset");
        } else if (entityType.equals(EntityType.ASSET)) {
            return (T) assetRepo.findById(id)
                    .map(Asset::getTitle)
                    .orElse("Unknown asset");
        } else if (entityType.equals(EntityType.USER)) {
            return (T) userRepository.findById(id)
                    .map(User::getFirstName)
                    .orElse("Unknown user");
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown entity type");
    }
}
