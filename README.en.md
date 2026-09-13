# CK-Bridge

[한국어](./README.kr.md) | [中文](./README.zh-CN.md) | [English](./README.en.md)

CK-Bridge is a cross-border commerce MVP for Chinese users. Even if users do not know the exact Korean product name, they can explore Korean products through images or product links, review prices, options, and estimated shipping costs in a format that is easier for Chinese users to understand, and then request a quote.

> CK-Bridge is currently a test and portfolio MVP. It does not support actual payment or purchasing.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [Main Screens](#main-screens)
- [2. Problem Definition](#2-problem-definition)
- [3. Initial Hypothesis](#3-initial-hypothesis)
- [4. Core Features](#4-core-features)
- [5. User Flow](#5-user-flow)
- [6. Admin Features](#6-admin-features)
- [7. Tech Stack](#7-tech-stack)
- [8. User Testing](#8-user-testing)
- [9. User Test Results](#9-user-test-results)
- [10. User Feedback](#10-user-feedback)
- [11. Improvements After Testing](#11-improvements-after-testing)
- [12. Problems Solved During Development](#12-problems-solved-during-development)
- [13. My Role in the Project](#13-my-role-in-the-project)
- [14. What I Learned](#14-what-i-learned)
- [15. Project Limitations](#15-project-limitations)
- [16. Future Expansion](#16-future-expansion)
- [17. Project Links](#17-project-links)

---

## 1. Project Overview

CK-Bridge is a **Korean product exploration and quote request service for Chinese users**.

Popular Korean products that are already well known in China can usually be found easily on platforms such as Taobao.

However, not every Korean product is sold on Chinese platforms. Products first discovered through SNS or images, products with limited distribution in China, or products sold only through specific Korean stores may be difficult to find without knowing the exact Korean product name or seller.

CK-Bridge allows users to begin product exploration in one of the following ways:

- Upload a product image
- Enter a Korean shopping site product link
- Browse recommended products

Users can then review product information and estimated costs before submitting a quote request.

---

## Main Screens

### Home

<p>
  <img src="./docs/images/home.jpg" width="200" alt="CK-Bridge Home">
</p>

Users can start with recommended products, image-based product search, or a Korean product link.

### AI Image-Based Product Exploration

<p>
  <img src="./docs/images/ai-recognition.jpg" width="200" alt="AI Product Recognition">
  <img src="./docs/images/ai-analysis.jpg" width="200" alt="AI Product Analysis">
</p>

After uploading a product image, AI analyzes product characteristics and provides estimated weight, international shipping cost, and recommended search keywords.

### Recommended Product Exploration

<p>
  <img src="./docs/images/products.jpg" width="200" alt="Recommended Product List">
</p>

The recommended product list shows CNY selling prices, Korean reference prices, discount information, and more.

### Product Details and Option Selection

<p>
  <img src="./docs/images/product-detail.jpg" width="200" alt="Product Details and Option Selection">
</p>

On the product detail page, users can check estimated weight and shipping cost and select quantities for each option.

### Quote Request Using a Product Link

<p>
  <img src="./docs/images/link-request.jpg" width="200" alt="Product Link Quote Request">
</p>

If users already know the Korean shopping site product link, they can enter the link and product information to request a quote directly.

### Quote Status and 1:1 Inquiry

<p>
  <img src="./docs/images/request-chat.jpg" width="200" alt="1-to-1 Inquiry">
</p>

After submitting a quote request, users can check its processing status and exchange messages with the administrator for each request.

### Admin Page

<p>
  <img src="./docs/images/admin-requests.jpg" width="200" alt="Admin Request Management">
  <img src="./docs/images/admin-products.jpg" width="200" alt="Admin Product Management">
</p>

The administrator can manage quote requests, customer messages, and recommended products.

### Admin Price Management

<p>
  <img src="./docs/images/admin-pricing.jpg" width="200" alt="Admin Price Settings">
</p>

The system calculates CNY selling prices based on Korean prices and the current exchange rate. The administrator can also set price adjustments and a reference list price for China.

---

## 2. Problem Definition

We assumed that Chinese users may encounter the following problems when searching for or purchasing Korean products.

### Problem 1. It can be difficult to identify the exact Korean product name from an image

Even when Chinese users discover Korean products through SNS or images, they may not know the brand name or exact Korean product name.

In this case, searching directly on Korean shopping sites can be difficult and may require additional research.

### Problem 2. Searching becomes more complicated when products are not available on Chinese platforms

Popular Korean products can already be found easily on platforms such as Taobao.

However, the following types of products may be more difficult to find directly on Chinese platforms:

- Products with limited distribution in China
- Products from smaller Korean brands
- Newly launched products
- Products first discovered through SNS or images
- Products sold only on specific Korean shopping sites

In these cases, users may need to search Korean websites themselves or ask someone else for product information.

### Problem 3. Korean product information must be reinterpreted for Chinese users

Product information on Korean shopping sites is primarily designed for Korean users.

For example:

- Prices are displayed in KRW
- Product options are mainly written in Korean
- International shipping costs to China are difficult to know in advance

As a result, even after finding a product, Chinese users may still need to convert prices and separately check shipping costs and product options.

---

## 3. Initial Hypothesis

We formed the following hypothesis:

> If Chinese users can begin product exploration through images or links without knowing the exact Korean product name, and can view product information and estimated costs in a format that is easier for them to understand, the inconvenience of purchasing Korean products could be reduced.

To test this hypothesis, we focused on the following experience instead of implementing a complete payment and purchasing system:

Product discovery
→ Product information
→ Price / options / shipping cost
→ Quote request
→ Inquiry with administrator

---

## 4. Core Features

### 4.1 Image-Based Korean Product Exploration

When a user uploads an image of a Korean product, AI analyzes product information from the image.

Even without knowing the exact Korean product name, users can begin product exploration using the image.

---

### 4.2 Korean Product Link Quote Request

Users who already know the Korean shopping site link for the product they want can directly enter the link and request a quote.

---

### 4.3 Recommended Korean Products

Users who do not have a specific product in mind can still explore Korean products through the recommended product list.

The following information is available for recommended products:

- Product image
- Seller
- CNY selling price based on the current exchange rate
- KRW reference price
- Discount information
- Short product description

---

### 4.4 Quantity Selection by Product Option

Administrators can register product options such as color, flavor, and size.

Users can choose the desired quantity for each option.

Example:

颜色

红色       [-] 0 [+]
蓝色       [-] 2 [+]
黄色       [-] 1 [+]

合计：3件

Selected options and quantities are included when the quote request is submitted.

---

### 4.5 Automatic KRW → CNY Conversion

Korean selling prices are automatically converted into Chinese yuan (CNY) based on the current exchange rate.

The customer interface prioritizes CNY pricing while showing KRW prices as reference information.

Example:

¥99

₩19,900 Korean reference price

---

### 4.6 Price Adjustment and Automatic Discount Rate

The administrator can adjust the CNY price based on the exchange-rate-converted price.

Example:

Korean selling price: ₩33,900
Exchange-rate price: ¥174
Price adjustment: +5
Final selling price: ¥179

If the list price is higher than the final selling price, the discount rate is automatically calculated and displayed to users.

Example:

¥179   10% OFF
¥199

If the list price is equal to the selling price or no list price is set, the discount rate is not displayed.

---

### 4.7 AI-Based Estimated Product Weight

If a product does not have actual weight information, AI is used to estimate its weight.

Once calculated, the estimated weight is stored in the database so that the AI API is not called repeatedly for the same product.

---

### 4.8 Estimated International Shipping Cost

A reference international shipping cost to China is calculated based on the estimated product weight.

For testing purposes, the current MVP uses the following reference shipping rates:

First 1kg: ¥38
Each additional 1kg: +¥12

Because actual logistics costs may differ, this amount is displayed only as an estimate.

---

### 4.9 Quote Request Status

Users can check the current status of their quote request on their request page.

Administrators can update request status and quote information from the admin page.

---

### 4.10 1:1 Inquiry Chat

Each quote request includes a message channel between the user and administrator.

The admin interface shows the most recent message and unread messages.

---

### 4.11 Admin Page

Administrators can use the following features:

- View quote requests
- Change request status
- Enter quote information
- View request-specific chats
- Check unread messages
- Add / edit / delete recommended products
- Show / hide products
- Manage product images
- Manage product options
- Adjust prices
- Set list prices and discounts

---

## 5. User Flow

### Starting from Recommended Products

Recommended product list
→ Product details
→ Select options / quantity
→ Request quote
→ 1:1 inquiry

### Finding a Product by Image

Upload product image
→ AI image analysis
→ Product exploration
→ Review product information
→ Request quote

### When the Korean Product Link Is Already Known

Enter Korean product link
→ Enter product information
→ Request quote
→ Admin confirmation
→ View quote result

---

## 6. Admin Features

The admin page provides the functionality needed to operate the service.

### Quote Request Management

- View all requests
- Review request details
- Change request status
- Enter quote information

### Chat Management

- View chats for each request
- View the latest message
- Display unread customer messages
- Mark messages as read
- Mark messages as unread again

### Recommended Product Management

- Add products
- Edit products
- Delete products
- Hide products
- Show products again
- Upload main product image
- Upload detail images
- Add product options
- Manage option values
- Enter Korean selling price
- Adjust CNY price
- Enter China reference list price
- Check automatic discount rate

---

## 7. Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes

### Database / Storage

- Supabase
- Supabase Storage

### AI

- Alibaba Cloud Model Studio
- Qwen Vision Language Model

### External API

- KRW → CNY Exchange Rate API

### Deployment

- Vercel
- Custom Domain

---

## 8. User Testing

After completing the MVP, we conducted user testing with 5 Chinese users.

The purpose of the test was to understand how real users interpreted the service and to identify problems that had not been anticipated during development.

The test covered the following areas:

- Ease of use
- Clarity of quote information
- Purchase intention
- Intention to reuse the service
- Most useful features
- Inconvenient parts of the experience
- Additional features users wanted

Because the test included only 5 participants, the results were not generalized to the entire Chinese consumer market. Instead, they were used as an **early exploratory user test**.

---

## 9. User Test Results

### Purchase Intention

Out of 5 participants:

- Would purchase: 1
- Might use depending on the situation: 4

### Intention to Reuse

- Would use again: 3
- Might use depending on the situation: 2

### Ease of Use

- Very easy: 2
- Easy: 3

### Clarity of Quote Information

- Very clear: 2
- Clear: 3

### Features Considered Useful

| Feature | Number of Users |
|---|---:|
| Popular product recommendations | 4 / 5 |
| Image-based product search | 4 / 5 |
| Quote confirmation | 3 / 5 |
| Product link request | 2 / 5 |
| Chat | 2 / 5 |

---

## 10. User Feedback

### 10.1 Recommended Products Were More Useful Than Expected

At the beginning of development, image-based product exploration was considered the most important feature.

However, in user testing, the recommended product feature was rated useful by 4 out of 5 participants, the same result as image-based product search.

This suggested that users may not always enter the service with a specific product in mind and that product exploration itself may also provide value.

---

### 10.2 Product Options and Quantity Selection Were Needed

Fashion, food, cosmetics, and other product categories often include multiple options such as colors or flavors.

After testing, we added a feature that allows administrators to freely register product options and users to select quantities for each option.

---

### 10.3 The Initial Home Screen Contained Too Much Information

The original home screen included a large amount of information in an attempt to explain the service.

However, this could make the service feel more complicated.

To improve this, the main actions on the home screen were simplified and reordered:

Recommended products
→ Find by image
→ Request with product link

---

### 10.4 Trust Was an Important Issue

Some users found it difficult to determine whether the unfamiliar website was a real shopping service and whether it was safe.

We considered this an important issue that a small personal MVP could face when attempting to operate as a real commerce service.

The project was therefore completed as a portfolio MVP rather than continued as a live commercial service, and the customer interface clearly indicates that it is a test version.

---

## 11. Improvements After Testing

After user testing, we made improvements based directly on user feedback and implemented additional features to improve the overall completeness of the MVP.

### Improvements Based on User Feedback

- Added product option management
- Added quantity selection by option
- Simplified the home screen structure
- Strengthened recommended product exploration
- Strengthened test-version messaging

### Additional Features Added to Improve MVP Completeness

- Displayed CNY as the primary price
- Displayed KRW as reference information
- Automatically reflected the current exchange rate
- Added admin price adjustment
- Added list price and automatic discount calculation
- Added AI-based estimated product weight
- Added estimated international shipping cost
- Added admin chat Inbox
- Added unread message indicators

---

## 12. Problems Solved During Development

### 12.1 Multiple Option Quantities Increased at the Same Time

After implementing product options, clicking the `+` button for one option caused quantities for other options to increase as well.

The browser console showed the following React warning:

Encountered two children with the same key

The cause was that duplicated option values could share the same React key and state identifier.

Initially, options were identified using:

Option type + option value

This was changed to:

groupIndex + valueIndex

In addition, even if old duplicated option values remain in the database, duplicate values are automatically removed on the customer-facing screen.

---

### 12.2 Repeated AI Weight API Calls

Calling the AI weight estimation API every time a user opened the product detail page would increase unnecessary API costs and response time.

The structure was changed as follows:

Product weight exists in DB
→ Use DB value

Product weight does not exist in DB
→ Estimate with AI
→ Save result to DB
→ Use DB value afterward

This reduced repeated AI API calls for the same product.

---

### 12.3 Protecting Admin Features

Administrator authentication was implemented so that normal users could not access functions such as adding recommended products or modifying quotes.

After admin login, access to admin APIs is verified using an HMAC-based session cookie.

Functions requiring Supabase administrator privileges are also processed through server-side APIs rather than being executed directly in the browser.

---

### 12.4 Handling Exchange Rate Changes

At first, we also considered allowing administrators to enter a fixed CNY selling price directly.

However, this would require every product price to be manually updated whenever the exchange rate changed.

Instead of storing the final selling price, the system stores a **price adjustment value**.

Korean selling price
× Current KRW/CNY exchange rate
+ Admin price adjustment
= Customer selling price

This allows customer prices to change automatically when the exchange rate changes.

---

## 13. My Role in the Project

This was an individual project, and I handled the entire process from planning to deployment.

- Idea planning
- Problem definition
- Service structure design
- User flow design
- UI implementation
- Frontend development
- Backend API development
- Supabase DB design
- Image Storage integration
- AI API integration
- Exchange rate API integration
- Admin page implementation
- User test design
- User testing with Chinese users
- Test result analysis
- Feedback-based feature improvements
- Vercel deployment
- Custom domain setup

---

## 14. What I Learned

### 14.1 What I Consider Important May Differ from What Users Consider Important

At the beginning of development, I believed image-based product exploration would be the most important feature.

However, actual testing showed that recommended products received the same level of positive feedback as image-based product search.

This confirmed that feature priorities assumed before development can differ from real user evaluations.

---

### 14.2 There Is No Need to Re-Solve Problems That Are Already Well Solved

Popular Korean products can already be purchased easily through platforms such as Taobao.

Therefore, trying to make CK-Bridge replace the entire Korean product purchasing experience would not be an appropriate direction.

Instead, it is more important to focus on situations that existing services do not solve well, such as products that are difficult to find on Chinese platforms or products discovered for the first time through images.

---

### 14.3 Translation and Localization Are Not the Same

Simply translating the service interface into Chinese does not automatically create a service that is truly suitable for Chinese users.

During actual testing, we found that factors beyond language, such as product option selection, shipping cost information, and the amount of information shown on screen, also affected the user experience.

This showed that localization is not only about translating text, but also about considering how local users understand information and take action.

---

### 14.4 User Flow Matters More Than the Number of Features

At first, I thought explaining more features would help users understand the service better.

In practice, more information could make it more difficult for users to understand what they should do first.

As a result, the home screen was simplified around the core user actions.

---

### 14.5 Limiting Scope Is Important in an MVP

A real purchasing-agent service would also require features such as:

- Membership system
- Payment
- Logistics
- Refunds
- Returns
- User verification
- Legal and tax handling

Implementing everything would make the project scope excessively large.

For this project, we therefore focused on the **experience of discovering a product and requesting a quote**.

---

## 15. Project Limitations

CK-Bridge is not a real commercial service. It is an MVP created for testing and portfolio purposes.

The following features were not implemented:

- Actual payment
- Actual product purchasing
- Chinese shipping address management
- Real logistics company API integration
- Order tracking
- Refunds and returns
- Full membership registration
- WeChat login
- Large-scale product data
- Full purchasing-agent operation system

AI-based product exploration also cannot guarantee that it will always identify or find the exact real product.

In addition, because user testing was limited to 5 participants, the results should be understood as exploratory feedback rather than representative market data.

---

## 16. Future Expansion

If the service were developed further, the following features could be considered:

- Product categories
- Product search
- WeChat login
- User accounts
- Chinese shipping address storage
- Real international logistics API integration
- Actual shipping cost calculation
- Payment
- Order management
- Delivery tracking
- Refunds / returns
- Product comparison
- User reviews
- Testing with a larger number of Chinese users

---

## 17. Project Links

### Service

https://ckbridgeshop.cn

### GitHub

https://github.com/haehwan2/reverse-shopping

---

## Notice

CK-Bridge is an MVP created for service idea validation and portfolio purposes.

Actual payment and product purchasing are currently not supported.