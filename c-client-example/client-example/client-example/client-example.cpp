#include <iostream>
#include <string>
#define CURL_STATICLIB
#include <curl/curl.h>

#ifdef _DEBUG
#    pragma comment (lib,"curl/libcurl_a_debug.lib")
#else
#    pragma comment (lib,"libcurl_a.lib")
#endif // _DEBUG

#pragma comment (lib,"Normaliz.lib")
#pragma comment (lib,"Ws2_32.lib")
#pragma comment (lib,"Wldap32.lib")
#pragma comment (lib,"Crypt32.lib")

static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    if (userp == NULL)
        return 0;
    userp->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;
    bool debug = false;

    std::string username;
    std::string password;

    std::cout << "Enter Username: ";
    std::getline(std::cin, username);
    std::cout << "Enter Password: ";
    std::getline(std::cin, password);

    curl = curl_easy_init();
    if (curl) {
        struct curl_slist* headers = NULL;
        if (!debug) {
            headers = curl_slist_append(headers, "X-security-Header: key");
        }

        std::string url = "http://localhost:3000/login?username=" + username + "&password=" + password;

        if (!debug) {
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        }
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }
        else {
            std::cout << readBuffer << std::endl;
        }

        if (!debug) {
            curl_slist_free_all(headers);
        }
        curl_easy_cleanup(curl);
    }
    return 0;
}