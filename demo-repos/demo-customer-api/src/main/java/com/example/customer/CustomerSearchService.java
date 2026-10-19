package com.example.customer;

import java.util.ArrayList;
import java.util.List;

/**
 * Customer search with pagination for the fictional demo customer API.
 * NOTE: deliberately buggy training sample for Jira DEV-142.
 */
public class CustomerSearchService {

    public record Customer(long id, String name) {
    }

    public record Page<T>(List<T> content, long totalElements, int totalPages, int page, int size) {
    }

    private final List<Customer> customers = new ArrayList<>();

    public void addCustomer(long id, String name) {
        customers.add(new Customer(id, name));
    }

    public Page<Customer> search(String nameFilter, int page, int size) {
        List<Customer> filtered = new ArrayList<>();
        for (Customer c : customers) {
            if (nameFilter == null || c.name().toLowerCase().contains(nameFilter.toLowerCase())) {
                filtered.add(c);
            }
        }
        int from = page * size;
        int to = Math.min(from + size, filtered.size());
        List<Customer> content = from >= filtered.size() ? List.of() : filtered.subList(from, to);
        // BUG: totals are computed from the page slice instead of the filtered result set
        int totalPages = (int) Math.ceil(content.size() / (double) size);
        return new Page<>(content, content.size(), totalPages, page, size);
    }
}
