package backend.app.auditLog.service;

import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.model.AuditLog;
import backend.app.auditLog.repository.AuditLogRepo;
import backend.app.user.model.User;
import backend.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepo repository;
    private final UserRepository userRepository;

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

}
