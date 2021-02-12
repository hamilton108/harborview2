package harborview.downloader;

import com.gargoylesoftware.htmlunit.WebClient;
import nordnet.downloader.PageInfo;
import nordnet.downloader.TickerInfo;
import oahu.financial.html.EtradeDownloader;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.function.Consumer;

public class DownloaderStub implements EtradeDownloader<PageInfo, TickerInfo, Serializable> {
    private boolean javaScriptEnabled = false;
    private final WebClient webClient;
    private String storePath;
    private HashMap<String,Integer> counterMap;
    private boolean applyCounter = false;
    private Consumer<PageInfo> onPageDownloaded;

    public DownloaderStub(String storePath) {
        this();
        this.storePath = storePath;
    }
    public DownloaderStub() {
        webClient = new WebClient();
        webClient.getOptions().setJavaScriptEnabled(isJavaScriptEnabled());
    }

    private int getCounter(String ticker) {
        if (counterMap == null) {
            counterMap = new HashMap<>();
        }
        Integer counter;
        if (!counterMap.containsKey(ticker)) {
            counterMap.put(ticker,1);
            counter = 1;
        }
        else {
            counter = counterMap.get(ticker) + 1;
            counterMap.put(ticker,counter);
        }

        return counter;
    }

    //region Private Methods
    private String tickerUrl(String ticker) {
        if (applyCounter) {
            return String.format("file:///%s/%s/%d.html", storePath, ticker, getCounter(ticker));
        }
        else {
            return String.format("file:///%s/%s/1.html", storePath, ticker);
        }
    }
    //endregion Private Methods


    @Override
    public List<PageInfo> downloadDerivatives(TickerInfo tickerInfo) {
        List<PageInfo> result = new ArrayList<>();

        try {
            var page = webClient.getPage(tickerUrl(tickerInfo.getTicker()));
            var pageInfo = new PageInfo(page,tickerInfo, "1");
            result.add(pageInfo);
            if (onPageDownloaded != null) {
                onPageDownloaded.accept(pageInfo);
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

        return result;
    }

    public void setOnPageDownloaded(Consumer<PageInfo> onPageDownloaded) {
        this.onPageDownloaded = onPageDownloaded;
    }
    //region interface EtradeDownloader
    /*


    @Override
    public Page downloadPaperHistory(String ticker) throws IOException {
        return null;
    }

    @Override
    public Page downloadDepth(String ticker) throws IOException {
        return null;
    }

    @Override
    public Page downloadPurchases(String ticker) throws IOException {
        return null;
    }
     */

    //endregion interface EtradeDownloader

    //region Properties
    boolean isJavaScriptEnabled() {
        return javaScriptEnabled;
    }

    public void setJavaScriptEnabled(boolean javaScriptEnabled) {
        this.javaScriptEnabled = javaScriptEnabled;
    }

    public void setStorePath(String storePath) {
        this.storePath = storePath;
    }

    public void setApplyCounter(boolean applyCounter) {
        this.applyCounter = applyCounter;
    }

    public String getStorePath() {
        return storePath;
    }

    //endregion Properties
}
