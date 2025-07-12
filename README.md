# 🎨 Graphics Programming Final Coursework — Face Detection & Color Segmentation

This interactive web-based application was built for the **Graphics Programming** module. It features real-time webcam integration, face detection using the `objectdetect` library, and various image processing techniques including RGB/XYZ/LAB channel extraction and pixel-level segmentation.

---

## 📸 Features

- **Live Webcam Feed** with canvas rendering
- **Face Detection** using `objectdetect.frontalface.js`
- **Image Capture** via `Enter` key press
- **Color Processing Filters**:
  - Grayscale filter
  - RGB Channel Extraction
  - XYZ & LAB Color Space Conversions
  - Facial Blurring (for anonymisation)
  - Interactive Color Segmentation using sliders

---

## 🧪 How to Use

1. **Open `index.html`** in a web browser (with webcam permissions enabled).
2. **Webcam Preview** appears with a prompt to press **Enter**.
3. Press **Enter** to:
   - Capture the current webcam frame.
   - Generate RGB, XYZ, and LAB sliders.
   - Display the processed images.
4. **Adjust Sliders** to explore and segment based on different color channel thresholds.
5. Scroll vertically to explore each processed version of the frame.

---

## 📁 Project Structure

```
project-root/
├── index.html                   # Main HTML interface
├── sketch.js                    # Drawing, processing, and UI logic
├── combined_javascript.txt      # (Merged logic for reference or archive)
├── libraries/
│   ├── p5.min.js
│   ├── p5.dom.js
│   ├── objectdetect.js
│   └── objectdetect.frontalface.js
```

---

## ⚙️ Technologies Used

- **p5.js** (drawing, image manipulation)
- **objectdetect.js** (face detection algorithm)
- **HTML5 Canvas & DOM**
- **JavaScript (modular functions & filters)**

---


## 📌 Educational Scope

This project demonstrates understanding of:
- Pixel-wise manipulation
- Color space transformations
- Real-time webcam integration
- Face detection techniques

---

## 🧠 Developer Commentary
This project deepened my understanding of color spaces and image segmentation. During development, I observed that different lighting conditions affect color channels uniquely — for example, outdoor photos often emphasize the red channel, while indoor lighting may result in stronger green tones.

Challenges & Solutions:
Face Detection in Uneven Lighting:
The objectdetect library struggled with shadows caused by directional lighting. To address this, I recommend using the application in a well-lit environment with even light distribution for better accuracy.

RGB to LAB Conversion:*
Converting RGB directly to LAB* required an intermediate transformation to the XYZ color space. I resolved this by implementing a two-step method (RGB → XYZ → LAB*) based on reliable online resources.

Segmentation Differences:
RGB segmentation removes all three channels progressively, resulting in a fading effect. In contrast, LAB-based segmentation isolates a single channel, leaving portions of the image visible. This distinction is reflected in the output clarity between the two modes.

Reflection:
I believe I used my time effectively and completed all required features. In hindsight, I would modularize my code further to improve readability and maintainability.

Extension Implemented:
Users can now retake their image by pressing the Enter key again, allowing for adjustments to facial expressions or lighting without needing to refresh the page — a practical workaround to the face detection limitations.

