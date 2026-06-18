package backend.auditLog.service;

import backend.auditLog.enums.ActionType;
import backend.auditLog.enums.EntityType;
import backend.auditLog.model.AuditLog;
import backend.auditLog.repository.AuditLogRepo;
import backend.user.service.UserService;
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

    public List<AuditLog> getAuditLogsByActionType(ActionType actionType){
        return repository.findByActionType(actionType);
    }

    public List<AuditLog> getAuditLogsByEntityType(EntityType entityType){
        return repository.findByEntityType(entityType);
    }

}
