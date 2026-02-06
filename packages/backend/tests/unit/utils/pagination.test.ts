import { describe, it, expect } from "vitest";
import { parsePagination, buildPaginatedResponse } from "../../../src/utils/pagination";

describe("parsePagination", () => {
  it("should return defaults when no query params provided", () => {
    const result = parsePagination({});
    expect(result).toEqual({
      skip: 0,
      take: 20,
      page: 1,
      pageSize: 20,
    });
  });

  it("should parse valid page and pageSize", () => {
    const result = parsePagination({ page: "2", pageSize: "10" });
    expect(result).toEqual({
      skip: 10,
      take: 10,
      page: 2,
      pageSize: 10,
    });
  });

  it("should handle string numbers", () => {
    const result = parsePagination({ page: "3", pageSize: "25" });
    expect(result.skip).toBe(50);
    expect(result.take).toBe(25);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(25);
  });

  it("should clamp page to minimum 1", () => {
    const result = parsePagination({ page: "0" });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  it("should clamp negative page to 1", () => {
    const result = parsePagination({ page: "-5" });
    expect(result.page).toBe(1);
  });

  it("should clamp pageSize to minimum 1", () => {
    const result = parsePagination({ pageSize: "0" });
    expect(result.pageSize).toBe(1);
  });

  it("should clamp pageSize to maximum 100", () => {
    const result = parsePagination({ pageSize: "500" });
    expect(result.pageSize).toBe(100);
  });

  it("should handle NaN values", () => {
    const result = parsePagination({ page: "abc", pageSize: "xyz" });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("should calculate correct skip for page 5 with pageSize 10", () => {
    const result = parsePagination({ page: "5", pageSize: "10" });
    expect(result.skip).toBe(40);
  });

  it("should accept numeric types", () => {
    const result = parsePagination({ page: 3, pageSize: 15 });
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(15);
    expect(result.skip).toBe(30);
  });
});

describe("buildPaginatedResponse", () => {
  it("should build correct response with data", () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = buildPaginatedResponse(data, 25, 1, 10);

    expect(result.data).toEqual(data);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it("should calculate totalPages correctly with even division", () => {
    const result = buildPaginatedResponse([], 100, 1, 10);
    expect(result.pagination.totalPages).toBe(10);
  });

  it("should round up totalPages for uneven division", () => {
    const result = buildPaginatedResponse([], 101, 1, 10);
    expect(result.pagination.totalPages).toBe(11);
  });

  it("should handle zero total", () => {
    const result = buildPaginatedResponse([], 0, 1, 20);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.data).toEqual([]);
  });

  it("should handle single page of results", () => {
    const data = [{ id: 1 }];
    const result = buildPaginatedResponse(data, 1, 1, 20);
    expect(result.pagination.totalPages).toBe(1);
  });
});
