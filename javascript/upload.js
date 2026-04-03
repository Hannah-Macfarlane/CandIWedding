document.addEventListener("DOMContentLoaded", () => {

    const uploadBtn = document.getElementById("upload-btn");
    const gallery   = document.getElementById("gallery");
    const status    = document.getElementById("status");

    uploadBtn.addEventListener("click", async () => {
        status.textContent = "Preparing upload...";

        try {
          // Step 1: Ask our serverless function for a secure signature
            const res = await fetch("/.netlify/functions/sign-upload", {
                method: "POST",
            });

            if (!res.ok) throw new Error("Could not get upload signature");

            const { signature, timestamp, cloudName, apiKey } = await res.json();

            status.textContent = "";

            // Step 2: Open the Cloudinary widget using the secure signature
            const widget = cloudinary.createUploadWidget(
                {
                    cloudName:    cloudName,
                    apiKey:       apiKey,
                    uploadSignature: signature,
                    uploadSignatureTimestamp: timestamp,

                    // Upload settings
                    folder:       "wedding-photos",
                    tags:         ["guest-upload"],
                    sources:      ["local", "camera"],
                    multiple:     true,
                    maxFiles:     20,
                    maxFileSize:  20000000,
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],

                    // Widget appearance
                    styles: {
                        palette: {
                            window:         "#FFFFFF",
                            windowBorder:   "#041d33",
                            tabIcon:        "#041d33",
                            menuIcons:      "#7da2c2",
                            textDark:       "#041d33",
                            textLight:      "#FFFFFF",
                            link:           "#7da2c2",
                            action:         "#041d33",
                            inactiveTabIcon:"#aaa",
                            error:          "#F44235",
                            inProgress:     "#7da2c2",
                            complete:       "#20B832",
                            sourceBg:       "#faeeef",
                        },
                    },
                },
                // Step 3: Handle the result
                (error, result) => {
                    if (error) {
                        console.error("Upload error:", error);
                        status.textContent = "Something went wrong. Please try again.";
                        return;
                    }
                    if (result.event === "success") {
                        const img = document.createElement("img");
                        img.src = result.info.secure_url;
                        img.alt = "Guest photo";
                        gallery.prepend(img);
                        status.textContent = "Photo uploaded successfully! 🎉";
                    }
                    if (result.event === "queues-end") {
                        status.textContent = "All photos uploaded! Thank you 💛";
                        widget.close();
                    }
                }
            );

            widget.open();

        } catch (err) {
            console.error(err);
            status.textContent = "Could not connect. Please try again.";
        }
    });

}); // End of DOMContentLoaded