import { shapeBoxPlot } from 'd3fc-shape';
import { rebind, rebindAll } from 'd3fc-rebind';
import boxPlotBase from '../boxPlotBase';
import colors from '../colors';

export default () => {

    const base = boxPlotBase();

    const pathGenerator = shapeBoxPlot()
        .value(0);

    const boxPlot = (data) => {
        const filteredData = data.filter(base.defined);
        const context = pathGenerator.context();

        pathGenerator.orient(base.orient());

        filteredData.forEach((d, i) => {
            context.save();

            const values = base.values(d, i);
            context.translate(values.origin[0], values.origin[1]);
            context.beginPath();

            pathGenerator.median(values.median)
                .upperQuartile(values.upperQuartile)
                .lowerQuartile(values.lowerQuartile)
                .high(values.high)
                .width(values.width)
                .low(values.low)([d]);

            context.strokeStyle = colors.black;
            context.fillStyle = colors.gray;

            base.decorate()(context, d, i);

            context.stroke();
            context.fill();
            context.closePath();

            context.restore();
        });
    };

    rebindAll(boxPlot, base);
    rebind(boxPlot, pathGenerator, 'cap', 'context');

    return boxPlot;
};
