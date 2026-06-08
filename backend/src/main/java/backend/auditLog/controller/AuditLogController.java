package backend.auditLog.controller;

import backend.auditLog.service.AuditLogService;
import backend.auditLog.model.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

}
