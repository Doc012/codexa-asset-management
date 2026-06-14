package backend.asset.controller;

import backend.asset.dto.RequestAssetDto;
import backend.asset.dto.ResponseAssetDto;
import backend.asset.dto.ResponseAssetsForUsersDto;
import backend.asset.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/users")
    public List<ResponseAssetsForUsersDto> getAllAssetsForUsers(){
        return assetService.getAllUserAssets();
    }

    @GetMapping("/{id}")
    public ResponseAssetDto getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseAssetDto createAsset(@RequestBody RequestAssetDto newAsset){
        return assetService.createAsset(newAsset);
    }

    @PutMapping("/{id}")
    public ResponseAssetDto updateAsset(@PathVariable Long id, @RequestBody RequestAssetDto asset){
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
        return assetService.getAssetsByCategory(category);
    }
}
