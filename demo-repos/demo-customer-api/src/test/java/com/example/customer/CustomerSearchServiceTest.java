package com.example.customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CustomerSearchServiceTest {

    private final CustomerSearchService service = new CustomerSearchService();

    @BeforeEach
    void seed() {
        for (int i = 1; i <= 25; i++) {
            service.addCustomer(i, "Alice %02d".formatted(i));
        }
        service.addCustomer(100, "Bob");
    }

    @Test
    void paginationIsCompleteWithoutDuplicatesOrGaps() {
        int size = 10;
        int totalPages = 3;
        Set<Long> seen = new HashSet<>();
        for (int p = 0; p < totalPages; p++) {
            CustomerSearchService.Page<CustomerSearchService.Customer> page = service.search("alice", p, size);
            assertEquals(25, page.totalElements(), "totalElements must be the filtered count");
            assertEquals(3, page.totalPages(), "totalPages must be ceil(filtered/size)");
            for (CustomerSearchService.Customer c : page.content()) {
                assertTrue(seen.add(c.id()), "duplicate customer on page " + p + ": " + c.id());
            }
        }
        assertEquals(25, seen.size(), "customers missing across pages");
    }

    @Test
    void resultsAreSortedByName() {
        CustomerSearchService.Page<CustomerSearchService.Customer> page = service.search("alice", 0, 25);
        List<String> names = page.content().stream().map(CustomerSearchService.Customer::name).toList();
        List<String> sorted = names.stream().sorted(String.CASE_INSENSITIVE_ORDER).toList();
        assertEquals(sorted, names, "results must be sorted by name (case-insensitive)");
    }

    @Test
    void filterNarrowingWorks() {
        CustomerSearchService.Page<CustomerSearchService.Customer> page = service.search("bob", 0, 10);
        assertEquals(1, page.totalElements());
        assertEquals("Bob", page.content().get(0).name());
    }
}
