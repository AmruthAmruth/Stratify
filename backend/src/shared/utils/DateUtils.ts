



export class DateUtils {
    





    static calculateWorkingDays(startDate: Date, endDate: Date): number {
        let count = 0;
        const current = new Date(startDate);
        const end = new Date(endDate);

        
        current.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    







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

        
        if (overlapStart > overlapEnd) {
            return null;
        }

        return { start: overlapStart, end: overlapEnd };
    }

    






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

    




    static toISODate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    







    static hasOverlap(
        rangeAStart: Date,
        rangeAEnd: Date,
        rangeBStart: Date,
        rangeBEnd: Date
    ): boolean {
        return rangeAStart <= rangeBEnd && rangeAEnd >= rangeBStart;
    }
}
