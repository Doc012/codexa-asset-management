package backend.auditLog.repository;

import backend.auditLog.enums.ActionType;
import backend.auditLog.enums.EntityType;
import backend.auditLog.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuditLogRepo extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByActionType(ActionType actionType);
    List<AuditLog> findByEntityType(EntityType entityType);
}
