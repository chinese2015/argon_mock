package com.example.argondemo.domain;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SubscriptionRepository extends JpaRepository<Subscription,String> {
    Optional<Subscription> findByConfirmTokenHashAndStatus(String hash, String status);
    Optional<Subscription> findByUnsubscribeTokenHash(String hash);
    List<Subscription> findByStatus(String status);
}
