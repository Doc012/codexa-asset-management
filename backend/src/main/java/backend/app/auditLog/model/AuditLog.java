package backend.app.auditLog.model;

import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.enums.ActionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

//    @JoinColumn(name = "user_id", nullable = false)
    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    private EntityType entityType;

    @JoinColumn(name = "entity_id", nullable = false)
    private Long entityId;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Column(name = "timestamp", nullable = false)
    @CreationTimestamp
    private LocalDateTime timestamp;

    @Column(name = "old_value", nullable = false)
    private String oldValue;

    @Column(name = "new_value", nullable = false)
    private String newValue;

    @Column(name = "message")
    private String message;










}
