// ============================
// NUTRA PAGE — Product Data & Interactions
// ============================

const productData = {
    // Beauty & Nutricosmetics
    collagen: {
        category: "Beauty & Nutricosmetics",
        title: "Collagen Peptides",
        tagline: "Youthful Skin. Strong Joints. Healthy Hair.",
        image: "images/Nutraceutical Products/Beauty & Nutricosmetics/Collagen Peptides.webp",
        why: "Collagen is the most abundant protein in the body, responsible for skin elasticity, joint strength, and connective tissue health. As we age, collagen production declines—leading to wrinkles, weaker hair, and joint stiffness. Supplementing with collagen peptides helps replenish what your body naturally loses.",
        ingredients: [
            "Marine/Bovine Collagen Peptides – Hydrolysed collagen for better absorption, supporting skin firmness, joint comfort, and hair & nail strength."
        ],
        benefits: [
            "Improves skin elasticity and hydration",
            "Supports healthy hair growth and stronger nails",
            "Promotes joint flexibility and bone strength",
            "Helps reduce visible signs of ageing",
            "Supports overall wellness and recovery"
        ],
        dosage: "Take 1 serving once daily, mixed with water, juice, or a smoothie, or as advised by your healthcare professional.",
        who: "Ideal for men and women looking to improve skin health, strengthen hair and nails, support joint mobility, or maintain overall beauty and wellness."
    },
    biotin: {
        category: "Beauty & Nutricosmetics",
        title: "Biotin",
        tagline: "Stronger Hair. Healthier You.",
        image: "images/Nutraceutical Products/Beauty & Nutricosmetics/Biotin.webp",
        why: "Biotin helps your body convert nutrients into energy and supports keratin production—the key protein that keeps hair strong, skin smooth, and nails resilient. Daily supplementation helps maintain healthy beauty and overall wellness.",
        ingredients: [
            "Biotin (Vitamin B7) – Essential for healthy hair growth, skin nourishment, nail strength, and metabolism support."
        ],
        benefits: [
            "Supports stronger, thicker hair",
            "Promotes healthy skin and natural glow",
            "Helps reduce brittle nails",
            "Supports energy metabolism",
            "Contributes to overall beauty and wellness"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal, or as advised by your healthcare professional.",
        who: "Ideal for men and women experiencing hair thinning, weak nails, dull skin, or anyone wanting to support natural beauty and daily nutrition."
    },
    hyaluronic: {
        category: "Beauty & Nutricosmetics",
        title: "Hyaluronic Acid",
        tagline: "Deep Hydration. Timeless Glow.",
        image: "images/Nutraceutical Products/Beauty & Nutricosmetics/Hyaluronic Acid.webp",
        why: "Hyaluronic Acid is naturally present in the skin and connective tissues, where it holds moisture and maintains firmness. As levels decline with age, skin can become dry and lose elasticity. Supplementing helps restore hydration, keeping your skin youthful and supple.",
        ingredients: [
            "Sodium Hyaluronate – A highly bioavailable form of Hyaluronic Acid that helps retain moisture, improve skin smoothness, and support joint comfort."
        ],
        benefits: [
            "Deeply hydrates skin from within",
            "Improves skin elasticity and smoothness",
            "Helps reduce dryness and fine lines",
            "Supports joint lubrication and comfort",
            "Promotes healthy, radiant-looking skin"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal, or as advised by your healthcare professional.",
        who: "Ideal for men and women experiencing dry skin, dull complexion, early signs of ageing, or anyone wanting to support long-term skin hydration and joint comfort."
    },
    silica: {
        category: "Beauty & Nutricosmetics",
        title: "Silica + MSM",
        tagline: "Strength Meets Radiance.",
        image: "images/Nutraceutical Products/Beauty & Nutricosmetics/Silica + MSM.webp",
        why: "Both ingredients play a key role in collagen formation and connective tissue health, helping maintain strength, flexibility, and beauty as you age.",
        ingredients: [
            "Bamboo Silica – A natural source of silica that supports collagen production, hair thickness, skin elasticity, and nail strength.",
            "MSM (Methylsulfonylmethane) – A natural sulphur compound that supports joint flexibility, skin health, and stronger hair and nails."
        ],
        benefits: [
            "Promotes stronger, shinier hair",
            "Supports healthy, glowing skin",
            "Helps reduce brittle nails",
            "Supports collagen production",
            "Improves joint flexibility and comfort"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal, or as advised by your healthcare professional.",
        who: "Ideal for men and women looking to improve hair strength, skin elasticity, nail health, and joint comfort."
    },
    vitaminECoQ10: {
        category: "Beauty & Nutricosmetics",
        title: "Vitamin E + CoQ10",
        tagline: "Antioxidant Power. Ageless Vitality.",
        image: "images/Nutraceutical Products/Beauty & Nutricosmetics/Vitamin E + CoQ10.webp",
        why: "Together, these nutrients provide advanced antioxidant protection while supporting skin, heart, and cellular health.",
        ingredients: [
            "Vitamin E (Tocopherol) – Helps protect cells from oxidative stress, supports skin hydration, and promotes immune health.",
            "CoQ10 (Coenzyme Q10) – Supports cellular energy production, heart function, and overall vitality."
        ],
        benefits: [
            "Provides strong antioxidant protection",
            "Supports heart and cellular energy health",
            "Promotes glowing, healthy skin",
            "Helps reduce signs of ageing",
            "Supports immunity and overall wellness"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal, or as advised by your healthcare professional.",
        who: "Ideal for men and women seeking antioxidant protection, heart support, healthier skin, and daily vitality."
    },

    // Fitness & Performance
    whey: {
        category: "Fitness & Performance",
        title: "Whey Protein",
        tagline: "Pure Protein. Powerful Results.",
        image: "images/Nutraceutical Products/Fitness & Performance/Whey Protein.webp",
        why: "Whey protein is one of the most effective proteins for muscle recovery and growth. Our formula is designed for purity, taste, and performance—perfect for athletes, gym-goers, and anyone looking to improve daily nutrition.",
        ingredients: [
            "Whey Protein Concentrate/Isolate – Rich in essential amino acids and BCAAs to support muscle repair and growth."
        ],
        benefits: [
            "Supports lean muscle growth",
            "Enhances post-workout recovery",
            "Boosts strength and stamina",
            "Helps meet daily protein needs",
            "Supports overall fitness and performance"
        ],
        dosage: "Mix 1 scoop daily after workout with water or milk, or as advised by your fitness trainer or healthcare professional.",
        who: "Ideal for athletes, gym enthusiasts, busy professionals, or anyone looking to increase protein intake for muscle recovery and overall fitness."
    },
    plantprotein: {
        category: "Fitness & Performance",
        title: "Plant Protein",
        tagline: "Clean Power. Plant Strength.",
        image: "images/Nutraceutical Products/Fitness & Performance/Plant Protein.webp",
        why: "Our blend of pea and rice proteins provides a balanced amino acid profile for effective muscle support and recovery, making it perfect for vegans, lactose-intolerant individuals, and anyone seeking a clean protein source.",
        ingredients: [
            "Pea Protein – Rich in BCAAs to support muscle growth and recovery.",
            "Rice Protein – Complements pea protein for a complete amino acid profile and better digestion."
        ],
        benefits: [
            "Supports lean muscle growth and recovery",
            "Provides clean, plant-based nutrition",
            "Easy to digest and light on the stomach",
            "Helps meet daily protein needs",
            "Suitable for vegan and lactose-free diets"
        ],
        dosage: "Mix 1 scoop daily with water, milk, or smoothies, preferably after a workout.",
        who: "Ideal for athletes, fitness enthusiasts, vegans, and anyone looking for a clean, plant-based protein option."
    },
    creatine: {
        category: "Fitness & Performance",
        title: "Creatine Monohydrate",
        tagline: "Explosive Strength. Proven Performance.",
        image: "images/Nutraceutical Products/Fitness & Performance/Creatine Monohydrate.webp",
        why: "Creatine supports the production of ATP (your body's energy source), helping muscles perform at higher intensity for longer periods. This leads to better strength, improved endurance, and faster muscle recovery.",
        ingredients: [
            "Creatine Monohydrate – Supports strength, power output, and lean muscle development."
        ],
        benefits: [
            "Increases strength and power",
            "Improves workout performance",
            "Supports lean muscle growth",
            "Enhances muscle recovery",
            "Helps boost endurance and stamina"
        ],
        dosage: "Take 5g once daily, mixed with water, juice, or your post-workout shake.",
        who: "Ideal for athletes, bodybuilders, fitness enthusiasts, and anyone looking to improve strength, performance, and muscle recovery."
    },
    bcaa: {
        category: "Fitness & Performance",
        title: "BCAA",
        tagline: "Fuel Muscle. Maximise Recovery.",
        image: "images/Nutraceutical Products/Fitness & Performance/BCAA.webp",
        why: "BCAAs are essential amino acids that your body cannot produce on its own. They play a key role in muscle protein synthesis and help reduce muscle breakdown during training.",
        ingredients: [
            "Leucine – Supports muscle growth and protein synthesis.",
            "Isoleucine – Helps with energy production and endurance.",
            "Valine – Supports muscle recovery and reduces fatigue."
        ],
        benefits: [
            "Supports muscle recovery and repair",
            "Reduces workout fatigue",
            "Helps prevent muscle breakdown",
            "Improves endurance and stamina",
            "Supports lean muscle development"
        ],
        dosage: "Mix 5g during workout with water or your sports drink.",
        who: "Ideal for athletes, gym enthusiasts, runners, and anyone looking to improve endurance, recovery, and muscle performance."
    },
    lcarnitine: {
        category: "Fitness & Performance",
        title: "L-Carnitine",
        tagline: "Burn Smarter. Perform Stronger.",
        image: "images/Nutraceutical Products/Fitness & Performance/L-Carnitine.webp",
        why: "L-Carnitine helps transport fatty acids into cells where they are used as fuel. This process supports energy production, exercise performance, and recovery.",
        ingredients: [
            "L-Carnitine Tartrate – A highly bioavailable form that supports fat metabolism, endurance, and muscle recovery."
        ],
        benefits: [
            "Supports fat metabolism and energy production",
            "Enhances workout endurance",
            "Helps improve recovery after exercise",
            "Supports lean muscle performance",
            "Helps reduce fatigue"
        ],
        dosage: "Take 1 capsule/tablet once daily, preferably before a workout.",
        who: "Ideal for athletes, gym enthusiasts, or anyone aiming to improve endurance, support fat metabolism, and boost workout performance."
    },

    // Gut Health
    probiotic: {
        category: "Gut Health",
        title: "Probiotic Complex",
        tagline: "Balance Within. Strength Beyond.",
        image: "images/Nutraceutical Products/Gut Health/Probiotic Complex.webp",
        why: "Your gut microbiome plays a vital role in digestion, nutrient absorption, immunity, and even mood. Stress, poor diet, and lifestyle factors can disrupt this balance. Our probiotic formula helps replenish beneficial bacteria.",
        ingredients: [
            "Lactobacillus – Supports digestion, reduces bloating, and promotes gut comfort.",
            "Bifidobacterium – Helps maintain healthy intestinal balance and supports immunity."
        ],
        benefits: [
            "Supports healthy digestion",
            "Helps reduce bloating and discomfort",
            "Strengthens immune function",
            "Promotes better nutrient absorption",
            "Supports gut microbiome balance"
        ],
        dosage: "Take 1 capsule daily, preferably after a meal.",
        who: "Ideal for men and women experiencing digestive discomfort, irregular digestion, after antibiotic use, or anyone wanting to support gut and immune health."
    },
    digestive: {
        category: "Gut Health",
        title: "Digestive Enzymes",
        tagline: "Digest Better. Live Lighter.",
        image: "images/Nutraceutical Products/Gut Health/Digestive Enzymes.webp",
        why: "Modern diets, stress, and ageing can reduce your body's natural enzyme production, leading to indigestion, heaviness, and nutrient gaps.",
        ingredients: [
            "Amylase – Helps break down carbohydrates for easier digestion.",
            "Protease – Supports protein digestion and nutrient absorption.",
            "Lipase – Aids fat digestion and helps reduce heaviness after meals."
        ],
        benefits: [
            "Improves digestion of carbs, proteins, and fats",
            "Helps reduce bloating and heaviness",
            "Supports better nutrient absorption",
            "Promotes gut comfort after meals",
            "Helps maintain digestive balance"
        ],
        dosage: "Take 1 capsule before meals, or as advised by your healthcare professional.",
        who: "Ideal for men and women experiencing bloating, indigestion, heaviness after meals, or anyone wanting to support healthy digestion."
    },
    prebiotic: {
        category: "Gut Health",
        title: "Prebiotic Fibre",
        tagline: "Feed Your Gut. Fuel Your Health.",
        image: "images/Nutraceutical Products/Gut Health/Prebiotic Fiber.webp",
        why: "Prebiotics are special plant fibres that act as food for good bacteria in your gut. By feeding these beneficial microbes, prebiotics help maintain a balanced microbiome and support digestion.",
        ingredients: [
            "Inulin – A natural soluble fibre that supports gut bacteria growth and improves digestion.",
            "FOS (Fructo-Oligosaccharides) – Helps increase beneficial bacteria and promotes gut balance."
        ],
        benefits: [
            "Supports a healthy gut microbiome",
            "Improves digestion and bowel regularity",
            "Helps reduce bloating and discomfort",
            "Enhances nutrient absorption",
            "Supports immunity and overall wellness"
        ],
        dosage: "Take once daily, mixed with water, juice, or smoothie.",
        who: "Ideal for men and women experiencing digestive imbalance, irregular bowel habits, or anyone looking to support gut health."
    },
    lglutamine: {
        category: "Gut Health",
        title: "L-Glutamine",
        tagline: "Restore. Repair. Rebuild.",
        image: "images/Nutraceutical Products/Gut Health/L-Glutamine.webp",
        why: "L-Glutamine is one of the most abundant amino acids in the body. During intense exercise, illness, or stress, levels can drop—leading to fatigue, slower recovery, and weakened immunity.",
        ingredients: [
            "L-Glutamine – Supports muscle repair, gut lining health, and immune function."
        ],
        benefits: [
            "Supports muscle recovery and repair",
            "Helps reduce post-workout soreness",
            "Supports gut lining and digestive health",
            "Promotes immune system support",
            "Helps maintain lean muscle mass"
        ],
        dosage: "Take 5g once daily, mixed with water, juice, or your post-workout shake.",
        who: "Ideal for athletes, gym enthusiasts, individuals recovering from intense training, or anyone wanting to support muscle recovery and gut health."
    },
    herbaldigestive: {
        category: "Gut Health",
        title: "Herbal Digestive Blend",
        tagline: "Traditional Comfort. Modern Wellness.",
        image: "images/Nutraceutical Products/Gut Health/Herbal Digestive Blend.webp",
        why: "Traditional herbal ingredients have been used for centuries to support digestive comfort and overall gut health.",
        ingredients: [
            "Herbal Digestive Blend – A curated mix of traditional herbs to support digestion and comfort."
        ],
        benefits: [
            "Supports comfortable digestion",
            "Helps reduce bloating naturally",
            "Traditional herbal support",
            "Gentle on the stomach",
            "Promotes overall digestive wellness"
        ],
        dosage: "Take as directed on the label or as advised by your healthcare professional.",
        who: "Ideal for anyone seeking gentle, herbal digestive support."
    },

    // Immunity & Daily Wellness
    vitamind3: {
        category: "Immunity & Daily Wellness",
        title: "Vitamin D3",
        tagline: "Sunshine in Every Capsule.",
        image: "images/Nutraceutical Products/Immunity & Daily Wellness/Vitamin D3.webp",
        why: "Vitamin D3 plays a key role in calcium absorption, bone strength, immune defence, and muscle function. Many people have low vitamin D levels due to modern lifestyles, making daily supplementation effective.",
        ingredients: [
            "Cholecalciferol (Vitamin D3) – The most bioavailable form of Vitamin D, supporting bone health, immunity, and muscle function."
        ],
        benefits: [
            "Supports strong bones and teeth",
            "Boosts immune system function",
            "Promotes muscle strength and energy",
            "Helps improve calcium absorption",
            "Supports overall wellness"
        ],
        dosage: "Take 1 soft gel daily with water after a meal.",
        who: "Ideal for men and women of all ages, especially those with low sun exposure, indoor lifestyles, or increased nutritional needs."
    },
    multivitamin: {
        category: "Immunity & Daily Wellness",
        title: "Multivitamin + Minerals",
        tagline: "Complete Nutrition. Complete Confidence.",
        image: "images/Nutraceutical Products/Immunity & Daily Wellness/Multivitamin + Minerals.webp",
        why: "Busy lifestyles, irregular meals, and stress can lead to nutrient deficiencies. A daily multivitamin helps maintain optimal nutrient levels, supporting your body's core functions.",
        ingredients: [
            "Vitamins A–Z – Support immunity, metabolism, energy production, and overall wellness.",
            "Zinc – Supports immune health, skin repair, and metabolism.",
            "Selenium – Provides antioxidant protection and supports thyroid function."
        ],
        benefits: [
            "Supports energy and stamina",
            "Strengthens immunity",
            "Promotes brain and heart health",
            "Supports skin, hair, and nail health",
            "Helps fill daily nutritional gaps"
        ],
        dosage: "Take 1 tablet daily with water after a meal.",
        who: "Ideal for men and women with busy lifestyles, irregular diets, or anyone wanting to support overall health and daily vitality."
    },
    vitaminczinc: {
        category: "Immunity & Daily Wellness",
        title: "Vitamin C + Zinc",
        tagline: "Double Defence for Daily Protection.",
        image: "images/Nutraceutical Products/Immunity & Daily Wellness/Vitamin C + Zinc.webp",
        why: "Vitamin C and Zinc work together to support immune health, skin repair, and overall wellness. This combination is ideal for daily protection against seasonal changes, stress, and busy lifestyles.",
        ingredients: [
            "Vitamin C (Ascorbic Acid) – Supports immune function, collagen formation, and antioxidant protection.",
            "Zinc – Helps maintain immune response, supports wound healing, and promotes healthy skin."
        ],
        benefits: [
            "Strengthens the immune system",
            "Helps fight infections and fatigue",
            "Supports skin repair and collagen production",
            "Provides antioxidant protection",
            "Supports faster recovery"
        ],
        dosage: "Take 1 tablet daily with water after a meal.",
        who: "Ideal for men and women seeking immune support, especially during seasonal changes, stress, travel, or increased exposure to pollution."
    },
    bcomplex: {
        category: "Immunity & Daily Wellness",
        title: "Vitamin B-Complex",
        tagline: "Energy That Powers Your Potential.",
        image: "images/Nutraceutical Products/Immunity & Daily Wellness/Vitamin B-Complex.webp",
        why: "B vitamins play a crucial role in metabolism, red blood cell formation, and nervous system function. Stress, busy routines, and poor diet can deplete these nutrients.",
        ingredients: [
            "Vitamin B1 (Thiamine) – Supports energy metabolism and nerve health.",
            "Vitamin B6 – Supports brain health and immunity.",
            "Vitamin B7 (Biotin) – Supports hair, skin, nails, and metabolism.",
            "Vitamin B12 – Supports nerve function and energy levels."
        ],
        benefits: [
            "Boosts natural energy levels",
            "Helps reduce fatigue and weakness",
            "Supports brain and nervous system health",
            "Promotes heart health",
            "Supports healthy hair, skin, and nails"
        ],
        dosage: "Take 1 capsule daily with water after a meal.",
        who: "Ideal for students, working professionals, vegetarians, older adults, or anyone experiencing fatigue, stress, or low energy."
    },
    zincselenium: {
        category: "Immunity & Daily Wellness",
        title: "Zinc + Selenium",
        tagline: "Essential Minerals. Elevated Immunity.",
        image: "images/Nutraceutical Products/Immunity & Daily Wellness/Zinc + Selenium.webp",
        why: "Zinc and Selenium are essential trace minerals that play a key role in immune response, cellular protection, and metabolic balance.",
        ingredients: [
            "Zinc Gluconate – Supports immune function, skin health, wound healing, and metabolism.",
            "Selenium – A potent antioxidant that supports thyroid health and protects cells from oxidative stress."
        ],
        benefits: [
            "Supports immune system function",
            "Provides antioxidant protection",
            "Supports healthy skin and hair",
            "Promotes thyroid and metabolic health",
            "Helps fight oxidative stress"
        ],
        dosage: "Take 1 tablet daily with water after a meal.",
        who: "Ideal for men and women seeking immune support, especially during seasonal changes, stress, or increased exposure to pollution."
    },

    // Men's Vitality
    testosterone: {
        category: "Men's Vitality",
        title: "Testosterone Support",
        tagline: "Strength. Energy. Performance.",
        image: "images/Nutraceutical Products/Men’s Vitality/Testosterone Support.webp",
        why: "Our formula combines traditional herbs with modern nutritional science to promote peak performance and balance for modern men.",
        ingredients: [
            "Ashwagandha – Helps reduce stress, supports endurance, and promotes healthy testosterone levels.",
            "Zinc – An essential mineral that contributes to normal testosterone production and reproductive health.",
            "Fenugreek – Traditionally used to support strength, stamina, and male vitality."
        ],
        benefits: [
            "Supports healthy testosterone levels",
            "Boosts energy and stamina",
            "Promotes muscle strength and recovery",
            "Helps manage stress and fatigue",
            "Supports male reproductive wellness"
        ],
        dosage: "Take 1 capsule/tablet once daily with water, preferably after a meal.",
        who: "Ideal for men experiencing low energy, reduced stamina, high stress levels, or those wanting to support strength, performance, and overall vitality."
    },
    prostate: {
        category: "Men's Vitality",
        title: "Prostate Health",
        tagline: "Protect What Matters.",
        image: "images/Nutraceutical Products/Men’s Vitality/Prostate Health.webp",
        why: "Our carefully selected ingredients work together to nourish and protect prostate function for long-term male wellness.",
        ingredients: [
            "Saw Palmetto Extract – Traditionally used to support prostate size and healthy urinary flow.",
            "Zinc – Contributes to normal prostate function and male reproductive health.",
            "Pumpkin Seed Extract – Supports bladder comfort and urinary health.",
            "Lycopene – A powerful antioxidant that helps protect prostate cells from oxidative stress."
        ],
        benefits: [
            "Supports healthy prostate function",
            "Promotes normal urinary flow and comfort",
            "Helps reduce frequent nighttime urination",
            "Provides antioxidant protection",
            "Supports overall male wellness"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal.",
        who: "Ideal for men over 35–40 years or anyone looking to maintain prostate health, urinary comfort, and long-term male wellness."
    },
    larginine: {
        category: "Men's Vitality",
        title: "L-Arginine + CoQ10",
        tagline: "Power Your Performance.",
        image: "images/Nutraceutical Products/Men’s Vitality/L-Arginine + CoQ10.webp",
        why: "Our formula pairs two science-backed nutrients that work together for better endurance and vitality.",
        ingredients: [
            "L-Arginine – An amino acid that supports nitric oxide production, helping improve blood flow, stamina, and muscle performance.",
            "CoQ10 (Coenzyme Q10) – A vital antioxidant that supports heart health and helps cells produce energy efficiently."
        ],
        benefits: [
            "Supports healthy blood circulation",
            "Boosts stamina and endurance",
            "Promotes heart and vascular health",
            "Enhances cellular energy production",
            "Helps reduce fatigue and improve recovery"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal.",
        who: "Ideal for men with busy lifestyles, athletes, or anyone looking to support heart health, stamina, and overall performance."
    },

    // Weight Loss & Detox
    garcinia: {
        category: "Weight Loss & Detox",
        title: "Garcinia Cambogia",
        tagline: "Natural Appetite & Weight Support.",
        image: "images/Nutraceutical Products/Weight Loss & Detox/Garcinia Cambogia.webp",
        why: "Garcinia Cambogia contains HCA (Hydroxycitric Acid), which may help support appetite management and healthy weight goals when combined with a balanced diet and exercise.",
        ingredients: [
            "Garcinia Cambogia Extract (HCA) – Supports appetite control and healthy weight management."
        ],
        benefits: [
            "Supports natural appetite control",
            "Helps with healthy weight management",
            "Supports metabolic balance",
            "Promotes overall wellness",
            "Complements a balanced lifestyle"
        ],
        dosage: "Take as directed on the label, preferably before meals.",
        who: "Ideal for men and women looking to support healthy weight management goals alongside a balanced diet and exercise."
    },
    greentea: {
        category: "Weight Loss & Detox",
        title: "Green Tea Extract",
        tagline: "Thermogenic Fat Metabolism Support.",
        image: "images/Nutraceutical Products/Weight Loss & Detox/Green Tea Extract.webp",
        why: "Green Tea Extract is rich in EGCG and other catechins that support thermogenesis and fat metabolism, making it a popular choice for natural weight management.",
        ingredients: [
            "Green Tea Extract (EGCG) – Supports fat metabolism, antioxidant protection, and energy levels."
        ],
        benefits: [
            "Supports thermogenic fat metabolism",
            "Rich in antioxidants (EGCG)",
            "Promotes natural energy levels",
            "Supports metabolic health",
            "Helps with healthy weight management"
        ],
        dosage: "Take 1 capsule daily with water, preferably before a meal.",
        who: "Ideal for men and women seeking natural support for metabolism, energy, and weight management."
    },
    liverdetox: {
        category: "Weight Loss & Detox",
        title: "Liver Detox Blend",
        tagline: "Cleanse. Protect. Revive.",
        image: "images/Nutraceutical Products/Weight Loss & Detox/Liver Detox Blend.webp",
        why: "Your liver plays a vital role in detoxification, metabolism, and nutrient processing. Stress, poor diet, and pollution can burden liver function. Our herbal blend helps support natural liver health.",
        ingredients: [
            "Milk Thistle – Rich in silymarin, helps protect liver cells and support regeneration.",
            "Dandelion Extract – Supports bile flow and healthy digestion.",
            "Artichoke Extract – Promotes liver detox pathways and digestive comfort."
        ],
        benefits: [
            "Supports natural liver detox function",
            "Helps protect liver cells from oxidative stress",
            "Supports digestion and bile flow",
            "Promotes metabolic balance",
            "Helps reduce heaviness and fatigue"
        ],
        dosage: "Take 1 capsule/tablet once daily with water after a meal.",
        who: "Ideal for men and women exposed to pollution, processed foods, stress, or anyone wanting to support liver health and overall detox balance."
    },

    // Women Hormonal Health
    pcos: {
        category: "Women's Hormonal Health",
        title: "PCOS Balance Formula",
        tagline: "Harmony Within. Confidence Beyond.",
        image: "images/Nutraceutical Products/Women Hormonal Health/PCOS Balance Formula.webp",
        why: "PCOS can affect hormone balance, metabolism, cycle regularity, and overall wellbeing. Our formula is designed to support the body's natural hormonal pathways with clinically studied nutrients.",
        ingredients: [
            "Myo-Inositol – Supports ovarian function, hormonal balance, and insulin sensitivity.",
            "D-Chiro Inositol – Works synergistically with Myo-Inositol to support healthy cycle regularity and metabolic balance.",
            "Folic Acid – Supports reproductive health and overall well-being."
        ],
        benefits: [
            "Supports hormonal balance",
            "Helps regulate menstrual cycles",
            "Supports insulin sensitivity",
            "Promotes ovarian health",
            "Supports overall reproductive wellness"
        ],
        dosage: "Take once daily, preferably after a meal.",
        who: "Ideal for women managing PCOS symptoms, irregular cycles, hormonal imbalance, or seeking reproductive health support."
    },
    menopause: {
        category: "Women's Hormonal Health",
        title: "Menopause Support",
        tagline: "Calm. Balance. Renew.",
        image: "images/Nutraceutical Products/Women Hormonal Health/Menopause Support.webp",
        why: "Hormonal changes during menopause can lead to hot flashes, mood swings, fatigue, and sleep disturbances. Our targeted formula helps support hormonal balance naturally.",
        ingredients: [
            "Black Cohosh Extract – Traditionally used to help ease hot flashes and support hormonal comfort.",
            "Soy Isoflavones – Plant-based phytoestrogens that support hormonal balance and bone health.",
            "Vitamin B6 – Supports mood balance, energy metabolism, and nervous system health."
        ],
        benefits: [
            "Helps reduce hot flashes and discomfort",
            "Supports hormonal balance",
            "Promotes mood stability and emotional well-being",
            "Supports energy levels and sleep quality",
            "Helps maintain bone and overall health"
        ],
        dosage: "Take 1 capsule daily with water after a meal.",
        who: "Ideal for women experiencing perimenopause or menopause symptoms, or anyone seeking natural support for hormonal balance."
    },
    ironfolic: {
        category: "Women's Hormonal Health",
        title: "Iron + Folic Acid",
        tagline: "Stronger Blood. Stronger You.",
        image: "images/Nutraceutical Products/Women Hormonal Health/Iron + Folic Acid.webp",
        why: "Iron deficiency is one of the most common nutritional gaps, especially among women. Low iron can lead to tiredness, dizziness, poor concentration, and weak immunity. Our formula provides highly absorbable Iron Bisglycinate.",
        ingredients: [
            "Iron Bisglycinate – A highly absorbable, stomach-friendly form of iron that helps improve haemoglobin levels.",
            "Folic Acid (Vitamin B9) – Essential for red blood cell formation, cell growth, and women's reproductive health.",
            "Vitamin B12 – Supports energy production, brain function, and healthy nerve cells."
        ],
        benefits: [
            "Helps increase haemoglobin levels",
            "Reduces fatigue and weakness",
            "Supports red blood cell production",
            "Gentle on stomach with better absorption",
            "Supports energy, focus, and immunity"
        ],
        dosage: "Once daily after meals, or as directed by a healthcare professional. For best absorption, take with water and avoid tea/coffee immediately after.",
        who: "Ideal for women with low haemoglobin levels, individuals experiencing fatigue, vegetarians, or anyone needing daily iron support."
    }
};

function hasLoadableImage(path) {
    return new Promise((resolve) => {
        if (!path) {
            resolve(false);
            return;
        }

        const probe = new Image();
        probe.onload = () => resolve(true);
        probe.onerror = () => resolve(false);
        probe.src = path;
    });
}

function refreshCategoryCounts(blocks) {
    blocks.forEach((block) => {
        const countLabel = block.querySelector('.nutra-cat-count');
        if (!countLabel) return;
        const count = block.querySelectorAll('.nutra-product-card').length;
        countLabel.textContent = `${count} Products`;
    });
}

function pruneMissingImageCards(blocks) {
    const cards = document.querySelectorAll('.nutra-product-card');

    cards.forEach(async (card) => {
        const productId = parseNutraProductId(card);
        const product = productData[productId] || {};
        const img = card.querySelector('.nutra-card-img img');
        const path = product.image || img?.getAttribute('src') || '';
        const exists = await hasLoadableImage(path);
        if (exists) return;

        card.remove();
        refreshCategoryCounts(blocks);
    });
}

if (window.singleHerbProducts) {
    Object.assign(productData, window.singleHerbProducts);
}

function injectSingleHerbCapsulesSection() {
    if (!window.singleHerbProducts) return;

    const products = Object.entries(window.singleHerbProducts);
    if (!products.length) return;

    const pillsWrapper = document.querySelector('.nutra-pills-wrapper');
    if (pillsWrapper && !pillsWrapper.querySelector('[data-category="singleherb"]')) {
        const pill = document.createElement('button');
        pill.className = 'nutra-pill';
        pill.dataset.category = 'singleherb';
        pill.innerHTML = '<i class="fas fa-leaf"></i> Single Herb Capsules';
        pillsWrapper.appendChild(pill);
    }

    const productsSection = document.querySelector('.nutra-products-section');
    if (!productsSection || productsSection.querySelector('[data-cat="singleherb"]')) return;

    const cardsMarkup = products.map(([id, product]) => {
        const cardTitle = (product.title || '').replace(/\s*Capsules$/i, '') || product.title;
        const showcaseImage = product.image2 || product.image;

        return `
            <div class="nutra-product-card" onclick="openProductModal('${id}')">
                <div class="nutra-card-img">
                    <img src="${showcaseImage}" alt="${cardTitle}">
                </div>
                <div class="nutra-card-body">
                    <h3>${cardTitle}</h3>
                    <p>${product.tagline || 'Natural Ayurvedic wellness support.'}</p>
                    <span class="nutra-card-tag">Single Herb</span>
                </div>
                <div class="nutra-card-action">
                    <span>Learn More</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `;
    }).join('');

    const block = document.createElement('div');
    block.className = 'nutra-category-block';
    block.dataset.cat = 'singleherb';
    block.innerHTML = `
        <div class="nutra-category-header">
            <div class="nutra-cat-icon"><i class="fas fa-leaf"></i></div>
            <h2>Single Herb Capsules</h2>
            <div class="nutra-cat-line"></div>
            <span class="nutra-cat-count">${products.length} Products</span>
        </div>
        <div class="nutra-products-grid">
            ${cardsMarkup}
        </div>
    `;

    productsSection.appendChild(block);
}

// ============================
// Category Filter Logic
// ============================
document.addEventListener('DOMContentLoaded', function () {
    injectSingleHerbCapsulesSection();

    const pills = document.querySelectorAll('.nutra-pill');
    const blocks = document.querySelectorAll('.nutra-category-block');
    const cards = document.querySelectorAll('.nutra-product-card');

    prepareNutraShowcaseImages(cards);
    pruneMissingImageCards(blocks);

    pills.forEach(pill => {
        pill.addEventListener('click', function () {
            pills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const cat = this.dataset.category;

            blocks.forEach(block => {
                if (cat === 'all' || block.dataset.cat === cat) {
                    block.classList.remove('hidden');
                    block.style.animation = 'none';
                    block.offsetHeight; // trigger reflow
                    block.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    block.classList.add('hidden');
                }
            });
        });
    });
});

let nutraModalImages = [];
let nutraModalImageIndex = 0;

function parseNutraProductId(card) {
    const onclickValue = card.getAttribute('onclick') || '';
    const match = onclickValue.match(/openProductModal\('([^']+)'\)/);
    return match ? match[1] : '';
}

function deriveImageCandidates(imagePath) {
    if (!imagePath) return [];

    const dotIndex = imagePath.lastIndexOf('.');
    if (dotIndex === -1) return [];

    const base = imagePath.slice(0, dotIndex);
    const ext = imagePath.slice(dotIndex);
    const altExt = ext.toLowerCase() === '.jpg' ? '.png' : '.jpg';

    return [
        `${base}-2${ext}`,
        `${base}_2${ext}`,
        `${base} 2${ext}`,
        `${base}(2)${ext}`,
        `${base} (2)${ext}`,
        `${base}-2${altExt}`,
        `${base}_2${altExt}`,
        `${base} 2${altExt}`,
        `${base}(2)${altExt}`,
        `${base} (2)${altExt}`,
    ];
}

function resolveExistingImage(candidates) {
    return new Promise((resolve) => {
        const unique = [...new Set(candidates.filter(Boolean))];
        if (!unique.length) {
            resolve('');
            return;
        }

        let remaining = unique.length;

        unique.forEach((path) => {
            const probe = new Image();
            probe.onload = () => resolve(path);
            probe.onerror = () => {
                remaining -= 1;
                if (remaining === 0) resolve('');
            };
            probe.src = path;
        });
    });
}

function prepareNutraShowcaseImages(cards) {
    cards.forEach(async (card) => {
        const productId = parseNutraProductId(card);
        if (!productId || !productData[productId]) return;

        const imageElement = card.querySelector('.nutra-card-img img');
        if (!imageElement) return;

        const product = productData[productId];
        const primaryImage = product.image || imageElement.getAttribute('src') || '';
        const fallbackImage2 = product.image2 || '';

        const image2 = fallbackImage2 || await resolveExistingImage(deriveImageCandidates(primaryImage));
        if (!image2) return;

        product.image = image2;
        product.image2 = primaryImage;
        imageElement.setAttribute('src', image2);
    });
}

// ============================
// Modal Logic
// ============================
function openProductModal(productId) {
    const product = productData[productId];
    if (!product) return;

    const modal = document.getElementById('productModal');
    const imgContainer = document.getElementById('modalImage');

    const images = Array.isArray(product.images) && product.images.length
        ? product.images
        : [product.image, product.image2].filter(Boolean);

    nutraModalImages = [...new Set(images.filter(Boolean))];
    nutraModalImageIndex = 0;
    renderNutraModalImage(imgContainer, product.title);

    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalTagline').textContent = product.tagline;
    document.getElementById('modalWhy').textContent = product.why;
    document.getElementById('modalDosage').textContent = product.dosage;
    document.getElementById('modalWho').textContent = product.who;

    const ingredientsList = document.getElementById('modalIngredients');
    ingredientsList.innerHTML = product.ingredients.map(i => `<li>${i}</li>`).join('');

    const benefitsList = document.getElementById('modalBenefits');
    benefitsList.innerHTML = product.benefits.map(b => `<li>${b}</li>`).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderNutraModalImage(imgContainer, title) {
    if (!imgContainer || !nutraModalImages.length) return;

    const currentImage = nutraModalImages[nutraModalImageIndex];
    imgContainer.innerHTML = `<img src="${currentImage}" alt="${title}">`;

    if (nutraModalImages.length <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nutra-modal-carousel-btn nutra-modal-carousel-btn--prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nutra-modal-carousel-btn nutra-modal-carousel-btn--next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const indicators = document.createElement('div');
    indicators.className = 'nutra-modal-indicators';
    indicators.innerHTML = nutraModalImages
        .map((_, index) => `<button class="nutra-modal-indicator ${index === nutraModalImageIndex ? 'active' : ''}" data-index="${index}" aria-label="Go to image ${index + 1}"></button>`)
        .join('');

    imgContainer.appendChild(prevBtn);
    imgContainer.appendChild(nextBtn);
    imgContainer.appendChild(indicators);
}

function navigateNutraModalImage(direction) {
    if (nutraModalImages.length <= 1) return;

    nutraModalImageIndex += direction;
    if (nutraModalImageIndex < 0) nutraModalImageIndex = nutraModalImages.length - 1;
    if (nutraModalImageIndex >= nutraModalImages.length) nutraModalImageIndex = 0;

    const title = document.getElementById('modalTitle')?.textContent || 'Product Image';
    renderNutraModalImage(document.getElementById('modalImage'), title);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('nutra-modal-overlay')) {
        closeProductModal();
    }

    if (e.target.closest('.nutra-modal-carousel-btn--prev')) {
        navigateNutraModalImage(-1);
    }

    if (e.target.closest('.nutra-modal-carousel-btn--next')) {
        navigateNutraModalImage(1);
    }

    const indicator = e.target.closest('.nutra-modal-indicator');
    if (indicator) {
        nutraModalImageIndex = Number(indicator.dataset.index) || 0;
        const title = document.getElementById('modalTitle')?.textContent || 'Product Image';
        renderNutraModalImage(document.getElementById('modalImage'), title);
    }
});

// Close modal on ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProductModal();
    if (e.key === 'ArrowLeft') navigateNutraModalImage(-1);
    if (e.key === 'ArrowRight') navigateNutraModalImage(1);
});
