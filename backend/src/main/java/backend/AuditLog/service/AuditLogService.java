package backend.AuditLog.service;

import backend.AuditLog.model.AuditLog;
import backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

// Testing
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepo repository;
    private final UserService userService;

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
        return repository.findAll();
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
                .build();

        return repository.save(newLog);
    }

}
