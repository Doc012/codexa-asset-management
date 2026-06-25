package backend.app.asset.controller;

import backend.app.asset.dto.RequestAssetDto;
import backend.app.asset.dto.ResponseAssetDto;
import backend.app.asset.enums.AssetCategory;
import backend.app.asset.enums.AssetCondition;
import backend.app.asset.enums.AssetStatus;
import backend.app.asset.model.Asset;
import backend.app.asset.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public List<ResponseAssetDto> getAllAssets(){
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public ResponseAssetDto getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseAssetDto createAsset(
            @RequestPart("asset") @Valid RequestAssetDto newAsset,
            @RequestPart (value = "file", required = false)MultipartFile file){
        System.out.println("DTO: " + newAsset);
        System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
        return assetService.createAsset(newAsset, file);
    }

    @PutMapping("/{id}")
    public ResponseAssetDto updateAsset(
            @PathVariable Long id,
            @RequestBody RequestAssetDto asset){
        return assetService.updateAsset(id, asset);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseAssetDto getAssetBySerialNumber(@PathVariable String serialNumber){
        return assetService.getAssetBySerialNumber(serialNumber);
    }

    @GetMapping("/category/{category}")
    public List<ResponseAssetDto> getAssetsByCategory(@PathVariable String category){
        try {
            AssetCategory categoryReq = AssetCategory.valueOf(category.toUpperCase());
            return assetService.getAssetsByCategory(categoryReq);
        } catch (IllegalArgumentException ex){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid asset category. " + ex.getMessage()
            );
        }
    }

    @GetMapping("/status/{status}")
    public List<ResponseAssetDto> getAssetByStatus(@PathVariable String status) {
        try {
            AssetStatus statusReq = AssetStatus.valueOf(status.toUpperCase());
            return assetService.getAssetsByStatus(statusReq);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid asset status. " + ex.getMessage()
            );
        }
    }

    @GetMapping("/condition/{condition}")
    public List<Asset> getAssetByCondition(@PathVariable String condition){
        try {
            AssetCondition condUpper = AssetCondition.valueOf(condition.toUpperCase());
            return assetService.getAssetByCondition(condUpper);
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid condition. Valid values: NEW, GOOD, FAIR, DAMAGED, RETIRED"
            );
        }
    }

    @GetMapping("/location")
    public List<ResponseAssetDto> getByLocation(@RequestParam String location){
        return assetService.getByLocation(location);
    }
}
