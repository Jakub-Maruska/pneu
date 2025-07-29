<?php

// Define CURL_SSLVERSION_TLSv1_2 if it's not already defined
if (!defined('CURL_SSLVERSION_TLSv1_2')) {
    define('CURL_SSLVERSION_TLSv1_2', 6); // Define with the value used for CURL_SSLVERSION_TLSv1_2
}

require 'vendor/autoload.php';

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\BrowserKit\HttpBrowser;

function loginAndScrape($url, $email, $password) {
    $client = HttpClient::create([
        'verify_peer' => false,
        'verify_host' => false,
        'timeout' => 60, // Set a timeout value
    ]);
    $browser = new HttpBrowser($client);
    $crawler = $browser->request('GET', $url);

    // Dismiss cookie consent if present
    $crawler->filter('.cc-window .cc-btn.cc-allow')->each(function ($node) use ($browser) {
        $browser->click($node->link());
    });

    // Check if login form exists
    $form = $crawler->selectButton('Log in')->form();
    if ($form->count() > 0) {
        // Perform login
        $crawler = $browser->submit($form, array(
            'betburger_user_email' => $email,
            'betburger_user_password' => $password,
        ));

        // Check if login was successful
        if ($crawler->getUri() === 'https://www.betburger.com/profile') {
            $crawler = $browser->request('GET', 'https://www.betburger.com/arbs');

            // Scrape arbitrage data
            $arbsData = scrapeArbs($crawler);
            echo $arbsData;
        } else {
            echo "Login failed. Could not verify successful login.";
        }
    } else {
        echo "Login form not found.";
    }
}

function scrapeArbs($crawler) {
    $arbsData = $crawler->filter('.arb')->each(function ($node) {
        $percent = $node->filter('.percent')->text();
        $sport = $node->filter('.sport-name')->text();
        $updatedAt = $node->filter('.updated-at')->text();
        $eventName = $node->filter('.event-name .name')->text();
        $league = $node->filter('.event-name .league')->text();
        $market = $node->filter('.market')->text();
        $odds = $node->filter('.coefficient')->text();

        $bookmakers = $node->filter('.bet-wrapper')->each(function ($bookmakerNode) {
            return [
                'bookmakerName' => $bookmakerNode->filter('.bookmaker-name')->text(),
                'date' => $bookmakerNode->filter('.date')->text(),
                'event' => $bookmakerNode->filter('.event-name .name')->text(),
                'eventLeague' => $bookmakerNode->filter('.event-name .league')->text(),
                'marketInfo' => $bookmakerNode->filter('.market')->text(),
                'coefficient' => $bookmakerNode->filter('.coefficient')->text(),
            ];
        });

        return [
            'percent' => $percent,
            'sport' => $sport,
            'updatedAt' => $updatedAt,
            'bookmakers' => $bookmakers,
        ];
    });

    return formatArbsData($arbsData);
}

function formatArbsData($arbsData) {
    $formattedData = "";
    foreach ($arbsData as $arb) {
        $formattedData .= "Arbitrage Opportunity - {$arb['percent']} in {$arb['sport']} (Updated {$arb['updatedAt']})\n";
        foreach ($arb['bookmakers'] as $index => $bookmaker) {
            $formattedData .= "Bookmaker " . ($index + 1) . ": {$bookmaker['bookmakerName']}\n";
            $formattedData .= "Date: {$bookmaker['date']}\n";
            $formattedData .= "Event: {$bookmaker['event']}\n";
            $formattedData .= "League: {$bookmaker['eventLeague']}\n";
            $formattedData .= "Market: {$bookmaker['marketInfo']}\n";
            $formattedData .= "Coefficient: {$bookmaker['coefficient']}\n";
            $formattedData .= "-----------------------\n";
        }
    }
    return $formattedData;
}

// Replace with your actual email and password
$email = 'jakub.maruska014@gmail.com';
$password = 'nyggyd-Vuzjaq-1vofsu';

loginAndScrape('https://www.betburger.com/users/sign_in', $email, $password);
