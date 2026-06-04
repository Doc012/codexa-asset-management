package backend.repository;

import backend.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepo extends JpaRepository<Asset, Long> {

}
