import dayjs from 'dayjs';

export default {
    animations: {
        enabled: true,
        easing: 'linear',
        speed: 500,
        animateGradually: {
            enabled: true,
            delay: 3000
        },
        dynamicAnimation: {
            enabled: true,
            speed: 3000
        }
    },
    grid: {
        show: true,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        }
    },
    timestampLabelFormatter(timestamp: any) {
        const now = dayjs();
        const givenTimestamp = dayjs.unix(timestamp);
        return givenTimestamp.format('DD MMM HH:mm');
        // if (now.isSame(givenTimestamp, 'day')) {
        //     return givenTimestamp.format('HH:mm');
        // } else {
        //     return givenTimestamp.format('DD MMM HH:mm');
        // }
    },
    timestampLabelFormatterv2(timestamp: any) {
        const now = dayjs();
        const givenTimestamp = dayjs(timestamp);
        return givenTimestamp.format('DD MMM HH:mm');
        // if (now.isSame(givenTimestamp, 'day')) {
        //     return givenTimestamp.format('HH:mm');
        // } else {
        //     return givenTimestamp.format('DD MMM HH:mm');
        // }
    }
}