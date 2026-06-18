package backend.asset.repository;

import backend.asset.enums.AssetStatus;
import backend.asset.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepo extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySerialNumber(String serialNumber);
    List<Asset> findByCategory(String category);
    List<Asset> findByLocation(String location);
    List<Asset> findByCondition(String condition);
    List<Asset> findByAssetStatus(AssetStatus status);
}
