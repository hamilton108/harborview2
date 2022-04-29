package harborview.dto.html;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonGetter;
//import com.fasterxml.jackson.annotation.JsonIgnore;

public class Chart {
    private List<List<Double>> lines;
    private List<List<Double>> bars;
    private List<Candlestick> candlesticks;

    public Chart() {
    }

    public void addLine(List<Double> line) {
        if (lines == null) {
            lines = new ArrayList<>();
        }
        lines.add(line);
    }

    public void addBar(List<Double> bar) {
        if (bars == null) {
            bars = new ArrayList<>();
        }
        bars.add(bar);
    }

    @JsonGetter("lines")
    public List<List<Double>> getLines() {
        return lines;
    }

    @JsonGetter("bars")
    public List<List<Double>> getBars() {
        return bars;
    }

    @JsonGetter("candlesticks")
    public List<Candlestick> getCandlesticks() {
        return candlesticks;
    }

    public void setCandlesticks(List<Candlestick> candlesticks) {
        this.candlesticks = candlesticks;
    }
}
