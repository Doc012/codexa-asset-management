package backend.app.auditLog.dto;

import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;

import java.time.LocalDateTime;

public class AuditLogDTO {
    public record auditLogResponse(
          Long logId,
          String logCreatorEmail,
          String entityTitle,
          EntityType entityType,
          ActionType actionType,
          LocalDateTime timestamp,
          String oldValue,
          String newValue,
          String message
    ){}
}
