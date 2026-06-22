package backend.app.auditLog.controller;

import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.service.AuditLogService;
import backend.app.auditLog.model.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/logs")
public class AuditLogController {

    private final AuditLogService service;

    @GetMapping("/{id}")
    public AuditLog getAuditLog(@PathVariable Long id){
        return service.getAuditLogById(id);
    }

    @GetMapping
    public List<AuditLog> getAllAuditLogs(){
        return service.getAllAuditLogs();
    }

    @PostMapping
    public AuditLog createLog(@RequestBody AuditLog log){
        return service.createLog(log);
    }


    @GetMapping("/user/{id}")
    public List<AuditLog> getLogsByUserId(@PathVariable Long id){
        return service.getAuditLogsByUserId(id);
    }

    @GetMapping("/action-type")
    public List<AuditLog> getLogsByActionType(@RequestParam String action){
        try {
            ActionType actionTypeReq = ActionType.valueOf(action.toUpperCase());
            return service.getAuditLogsByActionType(actionTypeReq);
        } catch (IllegalArgumentException ex){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid action type. " + ex.getMessage()
            );
        }
    }

    @GetMapping("/entity-type")
    public List<AuditLog> getLogsByEntityType(@RequestParam String entity){
        try {
            EntityType entityType = EntityType.valueOf(entity.toUpperCase());
            return service.getAuditLogsByEntityType(entityType);
        } catch (IllegalArgumentException ex){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid entity type. " + ex.getMessage()
            );
        }
    }

}
