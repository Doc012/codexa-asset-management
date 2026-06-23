package backend.app.auditLog.controller;

import backend.app.auditLog.dto.AuditLogDTO;
import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.service.AuditLogService;
import backend.app.auditLog.model.AuditLog;
import backend.app.user.model.User;
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
    public AuditLogDTO.auditLogResponse getAuditLog(@PathVariable Long id){
        return service.getAuditLogById(id);
    }

    @GetMapping
    public List<AuditLogDTO.auditLogResponse> getAllAuditLogs(){
        return service.getAllAuditLogs();
    }

    @PostMapping
    public AuditLogDTO.auditLogResponse createLog(@RequestBody AuditLog log){
        return service.createLog(log);
    }


    @GetMapping("/user/{id}")
    public List<AuditLogDTO.auditLogResponse> getLogsByUserId(@PathVariable Long id){
        return service.getAuditLogsByUserId(id);
    }

    @GetMapping("/by-email")
    public List<AuditLogDTO.auditLogResponse> getLogsByUserEmail(@RequestParam String email){
        return service.getAuditLogsByUserEmail(email);
    }

    @GetMapping("/action-type")
    public List<AuditLogDTO.auditLogResponse> getLogsByActionType(@RequestParam String action){
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
    public List<AuditLogDTO.auditLogResponse> getLogsByEntityType(@RequestParam String entity){
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

    @GetMapping("manager/{id}")
    public List<AuditLogDTO.auditLogResponse> getManagerLogs(@PathVariable Long id){
        return service.managerLog(id);
    }

    @GetMapping("/manager")
    public List<AuditLogDTO.auditLogResponse> managerLogs(){
        return service.managerLogs();
    }

}
