/**
 * Date utility functions for sprint capacity calculations
 */

export class DateUtils {
    /**
     * Calculate the number of working days between two dates (excluding weekends)
     * @param startDate - Start date (inclusive)
     * @param endDate - End date (inclusive)
     * @returns Number of working days (Monday-Friday)
     */
    static calculateWorkingDays(startDate: Date, endDate: Date): number {
        let count = 0;
        const current = new Date(startDate);
        const end = new Date(endDate);

        // Reset time to midnight for accurate date comparison
        current.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            // Count only weekdays (Monday = 1 to Friday = 5)
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    /**
     * Get the overlapping date range between two date ranges
     * @param rangeAStart - Start of range A
     * @param rangeAEnd - End of range A
     * @param rangeBStart - Start of range B
     * @param rangeBEnd - End of range B
     * @returns Object with overlap start/end dates, or null if no overlap
     */
    static getOverlapDays(
        rangeAStart: Date,
        rangeAEnd: Date,
        rangeBStart: Date,
        rangeBEnd: Date
    ): { start: Date; end: Date } | null {
        const overlapStart = new Date(
            Math.max(rangeAStart.getTime(), rangeBStart.getTime())
        );
        const overlapEnd = new Date(
            Math.min(rangeAEnd.getTime(), rangeBEnd.getTime())
        );

        // No overlap if start is after end
        if (overlapStart > overlapEnd) {
            return null;
        }

        return { start: overlapStart, end: overlapEnd };
    }

    /**
     * Count total leave days within a sprint range
     * @param leaves - Array of leave objects with startDate and endDate
     * @param sprintStart - Sprint start date
     * @param sprintEnd - Sprint end date
     * @returns Total number of working days on leave within sprint
     */
    static countLeaveDays(
        leaves: Array<{ startDate: Date; endDate: Date }>,
        sprintStart: Date,
        sprintEnd: Date
    ): number {
        let totalLeaveDays = 0;

        for (const leave of leaves) {
            const overlap = DateUtils.getOverlapDays(
                leave.startDate,
                leave.endDate,
                sprintStart,
                sprintEnd
            );

            if (overlap) {
                totalLeaveDays += DateUtils.calculateWorkingDays(
                    overlap.start,
                    overlap.end
                );
            }
        }

        return totalLeaveDays;
    }

    /**
     * Format date to ISO string for consistent date handling
     * @param date - Date to format
     * @returns ISO string representation
     */
    static toISODate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    /**
     * Check if a date range overlaps with another date range
     * @param rangeAStart - Start of range A
     * @param rangeAEnd - End of range A
     * @param rangeBStart - Start of range B
     * @param rangeBEnd - End of range B
     * @returns True if ranges overlap
     */
    static hasOverlap(
        rangeAStart: Date,
        rangeAEnd: Date,
        rangeBStart: Date,
        rangeBEnd: Date
    ): boolean {
        return rangeAStart <= rangeBEnd && rangeAEnd >= rangeBStart;
    }
}
