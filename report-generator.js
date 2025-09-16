// Comprehensive Human Design Report Generator
class ReportGenerator {
    constructor(quizResult) {
        this.quizResult = quizResult;
        this.type = quizResult.type;
        this.authority = quizResult.authority;
        this.profile = quizResult.profile;
        this.centers = quizResult.centers || {};
        this.scores = quizResult.scores || {};
    }

    generateFullReport() {
        const report = {
            metadata: this.generateMetadata(),
            sections: [
                this.generateIntroductionSection(),
                this.generateTypeAnalysisSection(),
                this.generateAuthoritySection(),
                this.generateProfileSection(),
                this.generateCentersSection(),
                this.generateChannelsAndGatesSection(),
                this.generateLifePurposeSection(),
                this.generateCareerGuidanceSection(),
                this.generateRelationshipSection(),
                this.generateDecisionMakingSection(),
                this.generatePersonalGrowthSection(),
                this.generateHealthAndWellnessSection(),
                this.generateFinancialGuidanceSection(),
                this.generateSpiritualitySection(),
                this.generateConditioningPatternsSection(),
                this.generateDeconditioningGuideSection(),
                this.generateYearlyForecastSection(),
                this.generateDailyPracticesSection(),
                this.generateAffirmationsSection(),
                this.generateResourcesSection()
            ]
        };

        return report;
    }

    generateMetadata() {
        return {
            title: `Complete Human Design Report for ${this.type}`,
            subtitle: `Your Personalized 40+ Page Analysis`,
            generatedDate: new Date().toISOString(),
            type: this.type,
            authority: this.authority,
            profile: this.profile,
            version: "1.0",
            totalPages: 45
        };
    }

    generateIntroductionSection() {
        return {
            title: "Welcome to Your Human Design",
            pages: 3,
            content: {
                overview: this.getTypeOverview(),
                whatIsHumanDesign: this.getHumanDesignIntro(),
                howToUseThisReport: this.getUsageInstructions(),
                yourUniqueBlueprint: this.getPersonalizedIntro()
            }
        };
    }

    generateTypeAnalysisSection() {
        const typeDetails = this.getDetailedTypeAnalysis();
        return {
            title: `Deep Dive: The ${this.type}`,
            pages: 6,
            content: {
                typeOverview: typeDetails.overview,
                typeStrategy: typeDetails.strategy,
                typeSignature: typeDetails.signature,
                typeNotSelf: typeDetails.notSelf,
                typeQualities: typeDetails.qualities,
                typeChallenges: typeDetails.challenges,
                typeEvolution: typeDetails.evolution,
                typeFamousExamples: typeDetails.famousExamples
            }
        };
    }

    generateAuthoritySection() {
        const authorityDetails = this.getDetailedAuthorityAnalysis();
        return {
            title: `Your Inner Authority: ${this.authority}`,
            pages: 4,
            content: {
                authorityOverview: authorityDetails.overview,
                howToAccess: authorityDetails.howToAccess,
                decisionMakingProcess: authorityDetails.process,
                commonMistakes: authorityDetails.mistakes,
                practicalExercises: authorityDetails.exercises,
                realLifeExamples: authorityDetails.examples
            }
        };
    }

    generateProfileSection() {
        const profileDetails = this.getDetailedProfileAnalysis();
        return {
            title: `Your Profile: ${this.profile}`,
            pages: 4,
            content: {
                profileOverview: profileDetails.overview,
                lifeTheme: profileDetails.theme,
                unconsciousDesign: profileDetails.unconscious,
                consciousPersonality: profileDetails.conscious,
                lifeStages: profileDetails.stages,
                purposePath: profileDetails.purpose
            }
        };
    }

    generateCentersSection() {
        return {
            title: "Your Energy Centers Deep Dive",
            pages: 9,
            content: {
                centerOverview: this.getCenterOverview(),
                headCenter: this.getCenterAnalysis('head'),
                ajnaCenter: this.getCenterAnalysis('ajna'),
                throatCenter: this.getCenterAnalysis('throat'),
                identityCenter: this.getCenterAnalysis('identity'),
                willCenter: this.getCenterAnalysis('will'),
                emotionalCenter: this.getCenterAnalysis('emotional'),
                sacralCenter: this.getCenterAnalysis('sacral'),
                spleenCenter: this.getCenterAnalysis('spleen'),
                rootCenter: this.getCenterAnalysis('root')
            }
        };
    }

    generateChannelsAndGatesSection() {
        return {
            title: "Your Channels and Gates",
            pages: 5,
            content: {
                channelOverview: this.getChannelOverview(),
                activeChannels: this.getActiveChannels(),
                dominantGates: this.getDominantGates(),
                dormantGates: this.getDormantGates(),
                gateActivationGuidance: this.getGateActivationGuidance()
            }
        };
    }

    generateLifePurposeSection() {
        return {
            title: "Your Life Purpose and Mission",
            pages: 3,
            content: {
                purposeOverview: this.getLifePurpose(),
                missionStatement: this.getMissionStatement(),
                purposeAlignment: this.getPurposeAlignment(),
                purposeBlocks: this.getPurposeBlocks(),
                purposeActivation: this.getPurposeActivation()
            }
        };
    }

    generateCareerGuidanceSection() {
        return {
            title: "Career and Professional Guidance",
            pages: 4,
            content: {
                careerOverview: this.getCareerOverview(),
                idealEnvironments: this.getIdealEnvironments(),
                careerChallenges: this.getCareerChallenges(),
                successStrategies: this.getSuccessStrategies(),
                entrepreneurialGuidance: this.getEntrepreneurialGuidance(),
                workRelationships: this.getWorkRelationships()
            }
        };
    }

    generateRelationshipSection() {
        return {
            title: "Relationships and Compatibility",
            pages: 4,
            content: {
                relationshipOverview: this.getRelationshipOverview(),
                compatibilityInsights: this.getCompatibilityInsights(),
                communicationStyle: this.getCommunicationStyle(),
                relationshipChallenges: this.getRelationshipChallenges(),
                partnershipDynamics: this.getPartnershipDynamics(),
                familyDynamics: this.getFamilyDynamics()
            }
        };
    }

    generateDecisionMakingSection() {
        return {
            title: "Advanced Decision-Making Guide",
            pages: 3,
            content: {
                decisionOverview: this.getDecisionOverview(),
                decisionProcess: this.getDecisionProcess(),
                timingGuidance: this.getTimingGuidance(),
                decisionPitfalls: this.getDecisionPitfalls(),
                practicalFramework: this.getDecisionFramework()
            }
        };
    }

    generatePersonalGrowthSection() {
        return {
            title: "Personal Growth and Evolution",
            pages: 3,
            content: {
                growthOverview: this.getGrowthOverview(),
                evolutionPath: this.getEvolutionPath(),
                growthChallenges: this.getGrowthChallenges(),
                growthPractices: this.getGrowthPractices(),
                transformationGuidance: this.getTransformationGuidance()
            }
        };
    }

    generateHealthAndWellnessSection() {
        return {
            title: "Health and Wellness for Your Type",
            pages: 2,
            content: {
                healthOverview: this.getHealthOverview(),
                healthStrategies: this.getHealthStrategies(),
                stressManagement: this.getStressManagement(),
                vitalityTips: this.getVitalityTips()
            }
        };
    }

    generateFinancialGuidanceSection() {
        return {
            title: "Financial Design and Money Flow",
            pages: 2,
            content: {
                financialOverview: this.getFinancialOverview(),
                moneyPatterns: this.getMoneyPatterns(),
                wealthStrategies: this.getWealthStrategies(),
                financialBlocks: this.getFinancialBlocks()
            }
        };
    }

    generateSpiritualitySection() {
        return {
            title: "Spiritual Path and Higher Purpose",
            pages: 2,
            content: {
                spiritualOverview: this.getSpiritualOverview(),
                spiritualPractices: this.getSpiritualPractices(),
                connectionMethods: this.getConnectionMethods(),
                higherPurpose: this.getHigherPurpose()
            }
        };
    }

    generateConditioningPatternsSection() {
        return {
            title: "Understanding Your Conditioning",
            pages: 2,
            content: {
                conditioningOverview: this.getConditioningOverview(),
                identifyingConditioning: this.getConditioningIdentification(),
                conditioningImpacts: this.getConditioningImpacts(),
                liberationPath: this.getLiberationPath()
            }
        };
    }

    generateDeconditioningGuideSection() {
        return {
            title: "Your 7-Year Deconditioning Process",
            pages: 3,
            content: {
                deconditioningOverview: this.getDeconditioningOverview(),
                yearByYearGuide: this.getYearByYearGuide(),
                deconditioningPractices: this.getDeconditioningPractices(),
                supportSystems: this.getSupportSystems()
            }
        };
    }

    generateYearlyForecastSection() {
        return {
            title: "Your Yearly Forecast and Cycles",
            pages: 2,
            content: {
                forecastOverview: this.getForecastOverview(),
                personalYear: this.getPersonalYear(),
                importantTransits: this.getImportantTransits(),
                opportunityWindows: this.getOpportunityWindows()
            }
        };
    }

    generateDailyPracticesSection() {
        return {
            title: "Daily Practices for Your Design",
            pages: 2,
            content: {
                practiceOverview: this.getPracticeOverview(),
                morningPractices: this.getMorningPractices(),
                eveningPractices: this.getEveningPractices(),
                weeklyPractices: this.getWeeklyPractices()
            }
        };
    }

    generateAffirmationsSection() {
        return {
            title: "Personalized Affirmations",
            pages: 1,
            content: {
                affirmationOverview: this.getAffirmationOverview(),
                dailyAffirmations: this.getDailyAffirmations(),
                typeSpecificAffirmations: this.getTypeAffirmations(),
                transformationAffirmations: this.getTransformationAffirmations()
            }
        };
    }

    generateResourcesSection() {
        return {
            title: "Resources and Next Steps",
            pages: 1,
            content: {
                additionalResources: this.getAdditionalResources(),
                recommendedReading: this.getRecommendedReading(),
                nextSteps: this.getNextSteps(),
                supportCommunity: this.getSupportCommunity()
            }
        };
    }

    // Type-specific content methods
    getTypeOverview() {
        const overviews = {
            'Generator': "Generators are the life force of the planet, making up about 70% of the population. You have consistent access to sustainable energy when you're doing work that lights you up. Your strategy is to respond to life rather than initiate, and when you follow your gut responses to opportunities that excite you, you create satisfaction and success not just for yourself, but for everyone around you.",
            'Manifestor': "Manifestors are the initiators and pioneers, making up about 8% of the population. You have the power to start new things and create impact without needing to wait for external permission or energy. Your strategy is to inform others before you act, which allows your natural leadership and initiating power to flow more smoothly and with less resistance.",
            'Projector': "Projectors are the natural guides and system optimizers, making up about 20% of the population. You have profound wisdom about managing energy and guiding others toward efficiency and success. Your strategy is to wait for recognition and invitation before sharing your gifts, which ensures your wisdom is truly valued and received.",
            'Reflector': "Reflectors are the mirrors of humanity, making up about 1% of the population. You're deeply wise about community dynamics and reflect the health of your environment. Your strategy is to wait a full lunar cycle (about 28 days) before making major decisions, allowing you to experience the full spectrum of your wisdom before committing."
        };
        return overviews[this.type];
    }

    getHumanDesignIntro() {
        return "Human Design is a revolutionary system that reveals your unique energetic blueprint. Created by Ra Uru Hu in 1987, it synthesizes ancient and modern wisdom traditions including the I'Ching, astrology, Kabbalah, chakras, and quantum physics. Your Human Design chart, or Bodygraph, shows how you're designed to navigate life, make decisions, and interact with others in a way that's authentic to your true nature.";
    }

    getUsageInstructions() {
        return "This report is designed to be your comprehensive guide to living according to your Human Design. Read through it slowly, taking time to absorb and experiment with each section. Focus on understanding your Type and Strategy first, as these are the foundation of your design. Then explore your Authority, Profile, and Centers. Remember, Human Design is about experimentation - try these insights in your daily life and notice what feels correct for you.";
    }

    getPersonalizedIntro() {
        return `As a ${this.type} with ${this.authority} authority and a ${this.profile} profile, you have a unique way of moving through the world. This report will help you understand not just who you are, but how to make decisions, build relationships, pursue your purpose, and live in alignment with your authentic nature. Your journey of self-discovery through Human Design can transform every aspect of your life.`;
    }

    getDetailedTypeAnalysis() {
        const analyses = {
            'Generator': {
                overview: "Generators are the builders and creators of the world. You have a defined Sacral center that gives you access to consistent, sustainable life force energy. When you're engaged in work that lights you up, you have incredible endurance and can work longer and more efficiently than any other type. Your energy is magnetic - when you're lit up, you draw opportunities and people to you naturally.",
                strategy: "Your strategy is to RESPOND. This means waiting for life to come to you and then responding with your gut feeling - that immediate 'uh-huh' (yes) or 'uh-uh' (no) that comes from your Sacral center. When you respond correctly, you enter the flow state where work becomes play and you have unlimited energy.",
                signature: "SATISFACTION is your signature emotion. When you're living correctly as a Generator, you feel deeply satisfied with your work, relationships, and life direction. This satisfaction is a sign that you're on the right path and using your energy correctly.",
                notSelf: "FRUSTRATION is your not-self theme. You feel frustrated when you're not responding correctly, when you're forcing things to happen, or when you're doing work that doesn't light you up. Frustration is your internal guidance system telling you to course-correct.",
                qualities: "Natural builders, incredible work capacity, magnetic when excited, persistent, reliable, honest, transparent, powerful creative force, ability to master skills through repetition.",
                challenges: "Tendency to push and force, difficulty saying no, taking on too much, burnout from wrong work, impatience with the responding process, guilt about rest.",
                evolution: "Your evolution involves learning to trust your gut responses completely and building the courage to follow your excitement even when it doesn't make logical sense. As you mature in your design, you become a master of sustainable energy management.",
                famousExamples: "Albert Einstein, Oprah Winfrey, Madonna, John Lennon, Marie Curie, Walt Disney"
            },
            'Manifestor': {
                overview: "Manifestors are the initiators and visionaries of the world. You have the power to start new things and create impact without needing permission from others. You operate independently and can access creative energy in bursts. Your aura is closed and repelling, which gives you the energy to push through resistance and create change.",
                strategy: "Your strategy is to INFORM. Before you act on your urges to initiate or create change, inform those who will be impacted by your actions. This simple act of informing dramatically reduces resistance and allows your manifesting power to flow more smoothly.",
                signature: "PEACE is your signature emotion. When you're living correctly as a Manifestor, you feel at peace with your actions and their impact. You're not fighting against resistance or feeling guilty about your independence.",
                notSelf: "ANGER is your not-self theme. You feel angry when people try to control you, when you're not informing properly, or when you're not honoring your need for independence and freedom to act.",
                qualities: "Natural leaders, independent, innovative, powerful initiators, can work in spurts, create significant impact, ability to see the big picture, natural change agents.",
                challenges: "Can be seen as selfish or inconsiderate, difficulty with being controlled, anger when restricted, tendency to not inform, impatience with others' pace.",
                evolution: "Your evolution involves learning to inform gracefully and finding the balance between independence and collaboration. As you mature, you become a powerful force for positive change in the world.",
                famousExamples: "Johnny Depp, George W. Bush, Frida Kahlo, Jack Nicholson, Richard Burton, Robert De Niro"
            },
            'Projector': {
                overview: "Projectors are the guides and system optimizers of the world. You have profound wisdom about energy management and can see how systems and people can work more efficiently. You don't have consistent access to energy like Generators, but you can focus and penetrate deeply into whatever you're invited to guide.",
                strategy: "Your strategy is to WAIT FOR INVITATION. This applies especially to major life areas like love, work, and where you live. When you're properly invited and recognized for your gifts, you have access to the energy you need to be successful.",
                signature: "SUCCESS is your signature emotion. When you're living correctly as a Projector, you feel successful and recognized for your unique gifts. Your wisdom is valued and you're making a real difference.",
                notSelf: "BITTERNESS is your not-self theme. You feel bitter when you're not being recognized, when you're trying to force your way into situations, or when your wisdom isn't being valued or heard.",
                qualities: "Natural guides, deep wisdom, ability to see inefficiencies, excellent at managing others' energy, intuitive understanding of systems, focused penetrating awareness.",
                challenges: "Tendency to give unsolicited advice, difficulty waiting for invitation, comparison with Generator energy levels, feeling unrecognized, pushing to prove worth.",
                evolution: "Your evolution involves developing patience for the right invitations and building deep expertise in areas you're passionate about. As you mature, you become a sought-after guide and advisor.",
                famousExamples: "Barack Obama, Rami Malek, Mick Jagger, Napoleon Bonaparte, Woody Allen, Princess Diana"
            },
            'Reflector': {
                overview: "Reflectors are the mirrors and evaluators of humanity. You're deeply wise about community and have the ability to reflect the health and well-being of your environment. You're incredibly sensitive to energy and can feel and reflect what's happening in your community better than anyone else.",
                strategy: "Your strategy is to WAIT A LUNAR CYCLE (about 28 days) before making major decisions. This allows you to experience all aspects of a decision and ensures you're making choices from your deep wisdom rather than temporary influences.",
                signature: "SURPRISE is your signature emotion. When you're living correctly as a Reflector, life feels surprising and delightful. You're constantly amazed by what you discover about yourself and your world.",
                notSelf: "DISAPPOINTMENT is your not-self theme. You feel disappointed when you're trying to be like other types, when you're in unhealthy environments, or when you're making decisions too quickly.",
                qualities: "Incredible wisdom about community, deep sensitivity, ability to reflect truth, natural evaluators, unique perspectives, gift for seeing what others miss.",
                challenges: "Extreme sensitivity to environment, difficulty with quick decisions, tendency to lose sense of self, confusion about identity, feeling different from others.",
                evolution: "Your evolution involves finding healthy communities and learning to trust your unique lunar timing. As you mature, you become a wise elder whose insights are treasured by your community.",
                famousExamples: "Sandra Bullock, H.G. Wells, Ammachi, Fyodor Dostoevsky"
            }
        };
        return analyses[this.type];
    }

    getDetailedAuthorityAnalysis() {
        const analyses = {
            'Emotional': {
                overview: "Your authority lies in your emotional wave. You need to honor your emotional process and wait for clarity before making important decisions.",
                howToAccess: "Pay attention to your emotional state throughout the day. Notice when you feel emotional highs and lows. Your truth emerges in the calm, clear moments between the waves.",
                process: "When faced with a decision, give yourself time to feel it out. Check in with yourself when you're feeling high, low, and neutral. Your correct decision will feel consistently right across all emotional states.",
                mistakes: "Making decisions when you're emotionally high or low, rushing the decision process, ignoring your emotional state, trying to be 'rational' only.",
                exercises: "Daily emotional check-ins, journaling your feelings about decisions, waiting 24-48 hours before major choices, practicing patience with your process.",
                examples: "Before accepting a job offer, feel into it when you're excited, when you're worried, and when you're calm. The right decision will feel correct in all states."
            },
            'Sacral': {
                overview: "Your authority is in your gut response - that immediate 'uh-huh' or 'uh-uh' sound that comes from your belly before your mind can interfere.",
                howToAccess: "Ask yourself yes/no questions and listen for the immediate gut response. This works best when someone else asks you or when you ask out loud.",
                process: "Present decisions as yes/no questions to your Sacral. The response is immediate and often makes a sound. Trust this first response before your mind starts analyzing.",
                mistakes: "Overthinking decisions, ignoring the gut response, asking complex questions instead of simple yes/no ones, second-guessing your Sacral.",
                exercises: "Practice with simple yes/no questions throughout the day, have a friend ask you questions, make sounds when you respond (uh-huh/uh-uh), trust immediate responses.",
                examples: "'Should I take this meeting?' 'Should I eat this food?' 'Is this the right direction?' Listen for your gut's immediate response."
            },
            'Splenic': {
                overview: "Your authority is in your spleen - intuitive, spontaneous knowing that speaks in the moment. It's quiet and speaks only once.",
                howToAccess: "Pay attention to subtle intuitive hits, gut feelings, and spontaneous knowing. Your spleen speaks softly and in the present moment.",
                process: "Listen for subtle inner knowing and trust your first instinct. Your splenic authority is about survival and well-being - it knows what's healthy for you.",
                mistakes: "Ignoring subtle intuitive hits, overthinking and missing the moment, not trusting spontaneous knowing, waiting too long to act on splenic guidance.",
                exercises: "Practice mindfulness and present-moment awareness, trust first instincts, pay attention to subtle body sensations, act quickly on intuitive hits.",
                examples: "A subtle feeling that you shouldn't go down a certain street, an instant knowing that someone isn't right for you, a quiet voice saying 'yes' to an opportunity."
            },
            'Self-Projected': {
                overview: "Your authority comes through hearing yourself speak. You need to talk through decisions with trusted friends or even yourself to hear your truth.",
                howToAccess: "Find trusted friends or use voice memos to talk through decisions. As you speak, listen to what comes out of your mouth - your truth will be revealed.",
                process: "When facing a decision, talk it through out loud. Don't just think about it - speak it. Your truth emerges through the act of speaking.",
                mistakes: "Keeping decisions internal, not having trusted people to talk with, overthinking instead of speaking, not listening to what you're actually saying.",
                exercises: "Regular check-ins with trusted friends, voice journaling, talking through decisions out loud, practicing speaking your truth.",
                examples: "Calling a friend to talk through a job decision and hearing yourself say 'I just don't feel excited about it' - that's your authority speaking."
            }
        };
        return analyses[this.authority];
    }

    getDetailedProfileAnalysis() {
        const analyses = {
            '1/3': {
                overview: "You're the Investigator/Martyr. You need to deeply understand the foundations of whatever you're involved in, and you learn through trial and error.",
                theme: "Your life theme is about building solid foundations through investigation and then learning what works through direct experience and 'mistakes.'",
                unconscious: "Your unconscious 3rd line drives you to learn through trial and error. You're designed to try things, discover what doesn't work, and share that wisdom.",
                conscious: "Your conscious 1st line needs to investigate and understand foundations before you feel secure moving forward.",
                stages: "First half of life: Deep investigation and lots of trial and error. Second half: Sharing wisdom gained through experience.",
                purpose: "To build solid foundations and share the wisdom of what works and what doesn't through your direct experience."
            },
            '1/4': {
                overview: "You're the Investigator/Opportunist. You build solid foundations and then share your knowledge through your network of relationships.",
                theme: "Your life theme is about mastering subjects through investigation and then influencing others through your personal network.",
                unconscious: "Your unconscious 4th line is naturally networking and building relationships that will support your life path.",
                conscious: "Your conscious 1st line needs to deeply investigate and master the foundations of your interests.",
                stages: "Continuous cycle of investigation, mastery, and sharing through your network throughout life.",
                purpose: "To become an expert in your field and influence positive change through your relationships and network."
            },
            '2/4': {
                overview: "You're the Hermit/Opportunist. You have natural gifts that need time alone to develop, but they're expressed through your relationships.",
                theme: "Your life theme is about developing your natural talents in solitude and then sharing them through your network when called upon.",
                unconscious: "Your unconscious 4th line builds the network that will call you out of your hermit cave when your gifts are needed.",
                conscious: "Your conscious 2nd line wants to be left alone to naturally develop your gifts without pressure.",
                stages: "Alternating between hermit time for development and being called out to share your gifts through relationships.",
                purpose: "To develop your natural talents and share them with the world when properly called upon."
            },
            '2/5': {
                overview: "You're the Hermit/Heretic. You have natural gifts but are constantly projected upon by others who want you to solve their problems.",
                theme: "Your life theme involves managing projections while honoring your need for alone time to develop your natural gifts.",
                unconscious: "Your unconscious 5th line attracts projections and expectations from others who see you as having solutions.",
                conscious: "Your conscious 2nd line needs time alone and doesn't want to be bothered or pressured.",
                stages: "Learning to manage projections and expectations while maintaining healthy boundaries around your hermit time.",
                purpose: "To develop your gifts in solitude and provide practical solutions when genuinely called upon."
            },
            '3/5': {
                overview: "You're the Martyr/Heretic. You learn through trial and error and are projected upon to provide solutions based on your experience.",
                theme: "Your life theme is about gaining wisdom through mistakes and then being called upon to share practical solutions.",
                unconscious: "Your unconscious 5th line attracts people who project onto you and expect you to have answers and solutions.",
                conscious: "Your conscious 3rd line learns through trial and error, experimentation, and making 'mistakes.'",
                stages: "First half: Lots of trial and error and learning. Second half: Sharing practical wisdom and solutions.",
                purpose: "To discover what works through direct experience and provide practical, proven solutions to others."
            },
            '3/6': {
                overview: "You're the Martyr/Role Model. You learn through trial and error in the first half of life, then become a wise role model.",
                theme: "Your life theme has three distinct phases: trial and error, withdrawal and observation, then emerging as a wise role model.",
                unconscious: "Your unconscious 6th line goes through a three-phase process culminating in becoming a role model.",
                conscious: "Your conscious 3rd line learns through experimentation and trial and error, especially in youth.",
                stages: "Phase 1 (to ~30): Trial and error. Phase 2 (~30-50): Withdrawal and observation. Phase 3 (50+): Role model.",
                purpose: "To learn through experience and eventually become a wise role model for others to follow."
            },
            '4/6': {
                overview: "You're the Opportunist/Role Model. You build networks in youth and become an influential role model later in life.",
                theme: "Your life theme involves building extensive networks early in life and then using that foundation to become an influential role model.",
                unconscious: "Your unconscious 6th line develops through three phases, ultimately becoming a role model.",
                conscious: "Your conscious 4th line naturally builds networks and relationships that support your path.",
                stages: "Early life: Network building. Middle life: Integration. Later life: Influential role model.",
                purpose: "To build influential networks and become a role model who guides others toward success."
            },
            '4/1': {
                overview: "You're the Opportunist/Investigator. You network and influence while also needing to build solid foundations through investigation.",
                theme: "Your life theme balances relationship building with deep investigation and foundation building.",
                unconscious: "Your unconscious 1st line needs to investigate and understand foundations to feel secure.",
                conscious: "Your conscious 4th line builds networks and influences others through relationships.",
                stages: "Continuous balance between networking/influencing and withdrawing to investigate and build foundations.",
                purpose: "To influence positive change through your network while maintaining solid foundations of knowledge."
            },
            '5/1': {
                overview: "You're the Heretic/Investigator. You're projected upon to provide solutions, but you need solid foundations to back up your guidance.",
                theme: "Your life theme involves being projected upon for solutions while ensuring you have solid foundations to support your guidance.",
                unconscious: "Your unconscious 1st line needs to thoroughly investigate and understand foundations.",
                conscious: "Your conscious 5th line attracts projections and is expected to provide practical solutions.",
                stages: "Balancing the pressure to provide solutions with the need for solid investigation and foundation building.",
                purpose: "To provide well-researched, practical solutions backed by solid foundations of knowledge."
            },
            '5/2': {
                overview: "You're the Heretic/Hermit. You're called to provide solutions but need alone time to develop your natural gifts.",
                theme: "Your life theme involves managing the tension between being called out for solutions and needing hermit time.",
                unconscious: "Your unconscious 2nd line has natural gifts that need alone time to develop properly.",
                conscious: "Your conscious 5th line is projected upon and called to provide practical solutions.",
                stages: "Learning to balance being called out with protecting your need for alone time to develop your gifts.",
                purpose: "To develop your natural gifts in solitude and provide practical solutions when properly called upon."
            },
            '6/2': {
                overview: "You're the Role Model/Hermit. You're here to be an example while honoring your need for solitude and natural gift development.",
                theme: "Your life theme involves becoming a role model while maintaining healthy boundaries around your alone time.",
                unconscious: "Your unconscious 2nd line has natural gifts that need time and space to develop without pressure.",
                conscious: "Your conscious 6th line goes through three life phases, ultimately becoming a role model.",
                stages: "Three-phase development while protecting your hermit time: experimentation, withdrawal, role model emergence.",
                purpose: "To become a wise role model while honoring your natural gifts and need for solitude."
            },
            '6/3': {
                overview: "You're the Role Model/Martyr. You become a wise role model through learning from life's experiences and mistakes.",
                theme: "Your life theme is about becoming a role model through the wisdom gained from trial and error experiences.",
                unconscious: "Your unconscious 3rd line learns through trial and error, making 'mistakes' that become wisdom.",
                conscious: "Your conscious 6th line develops through three phases toward becoming a role model.",
                stages: "Three-phase process: experimentation and trial/error, withdrawal and integration, emergence as wise role model.",
                purpose: "To become a wise role model who guides others based on the wisdom gained through life experience."
            }
        };
        return analyses[this.profile] || analyses['1/3'];
    }

    // Additional helper methods for generating content sections...
    getCenterOverview() {
        return "Your nine energy centers are the foundation of your Human Design. Each center has its own intelligence and function. Defined (colored) centers are consistent and reliable sources of energy and wisdom. Undefined (white) centers are areas where you're learning and can be wise about others, but they're not reliable for consistent energy or decision-making.";
    }

    getCenterAnalysis(centerName) {
        const isDefined = this.centers[centerName] === true;
        const centerData = this.getCenterData(centerName);
        
        return {
            name: centerData.name,
            defined: isDefined,
            function: centerData.function,
            definedTraits: isDefined ? centerData.definedTraits : null,
            undefinedTraits: !isDefined ? centerData.undefinedTraits : null,
            guidance: isDefined ? centerData.definedGuidance : centerData.undefinedGuidance,
            healthTips: centerData.healthTips
        };
    }

    getCenterData(centerName) {
        const centerData = {
            head: {
                name: "Head Center",
                function: "Mental pressure and inspiration",
                definedTraits: "Fixed way of mental pressure, consistent inspiration patterns, reliable mental processing",
                undefinedTraits: "Open to all mental pressures, can amplify others' mental energy, wisdom about thinking patterns",
                definedGuidance: "Trust your consistent mental pressure patterns and use them to drive inspiration",
                undefinedGuidance: "Don't let others' mental pressure overwhelm you. You're wise about thinking but don't make decisions from mental pressure",
                healthTips: "Manage mental pressure through meditation and quiet time"
            },
            ajna: {
                name: "Ajna Center", 
                function: "Mental awareness and conceptualization",
                definedTraits: "Fixed way of processing and conceptualizing, consistent mental awareness, reliable thinking patterns",
                undefinedTraits: "Open to all ways of thinking, flexible mental processing, wisdom about different perspectives",
                definedGuidance: "Trust your consistent way of processing information and making sense of concepts",
                undefinedGuidance: "Don't get caught up in trying to be certain. Your gift is seeing multiple perspectives",
                healthTips: "Balance mental activity with physical movement and creative expression"
            },
            throat: {
                name: "Throat Center",
                function: "Communication and manifestation",
                definedTraits: "Consistent way of communicating, reliable access to expression, natural ability to manifest through voice",
                undefinedTraits: "Adaptable communication style, amplifies others' expression, wisdom about communication",
                definedGuidance: "Trust your natural communication style and use your voice to manifest",
                undefinedGuidance: "Don't try to talk just to fill silence. Wait for invitations to speak and watch your tendency to interrupt",
                healthTips: "Express yourself regularly and don't hold back your authentic voice"
            },
            identity: {
                name: "Identity Center",
                function: "Direction and love of self",
                definedTraits: "Fixed sense of identity and direction, consistent self-love, reliable life direction",
                undefinedTraits: "Flexible identity, open to different directions, wisdom about identity and self-love",
                definedGuidance: "Trust your consistent sense of direction and identity. You know who you are",
                undefinedGuidance: "Don't try to force a fixed identity. Your gift is adaptability and seeing others clearly",
                healthTips: "Honor your need for identity flexibility and avoid getting stuck in rigid self-concepts"
            },
            will: {
                name: "Will Center",
                function: "Willpower and ego",
                definedTraits: "Consistent access to willpower, fixed ego structure, reliable self-worth patterns",
                undefinedTraits: "No fixed willpower, flexible ego, wisdom about worth and willpower",
                definedGuidance: "Use your consistent willpower wisely and don't overcommit your will energy",
                undefinedGuidance: "Don't make promises you can't keep. Your worth isn't tied to proving yourself through willpower",
                healthTips: "Rest when your willpower is depleted and don't push through on will alone"
            },
            emotional: {
                name: "Emotional Center",
                function: "Emotions and feelings",
                definedTraits: "Consistent emotional wave, own emotional authority, reliable emotional patterns",
                undefinedTraits: "No consistent emotions, amplifies others' emotions, wisdom about emotional dynamics",
                definedGuidance: "Honor your emotional wave and wait for clarity before making decisions",
                undefinedGuidance: "Don't take on others' emotions as your own. You're wise about emotions but not emotional yourself",
                healthTips: "Create space to process emotions and don't suppress your emotional truth"
            },
            sacral: {
                name: "Sacral Center",
                function: "Life force energy and sexuality",
                definedTraits: "Consistent life force energy, reliable gut responses, sustainable work capacity",
                undefinedTraits: "No consistent energy, amplifies others' life force, wisdom about energy management",
                definedGuidance: "Follow your gut responses and use your energy for work that lights you up",
                undefinedGuidance: "Know when enough is enough. Don't try to keep up with Generator energy",
                healthTips: "Honor your energy rhythms and don't overextend yourself"
            },
            spleen: {
                name: "Spleen Center",
                function: "Intuition and immune system",
                definedTraits: "Consistent intuitive awareness, reliable immune system, fixed survival instincts",
                undefinedTraits: "Open to all intuitions, flexible immune system, wisdom about health and survival",
                definedGuidance: "Trust your consistent intuitive awareness and survival instincts",
                undefinedGuidance: "Don't hold onto fears that aren't yours. Your gift is recognizing what's healthy",
                healthTips: "Listen to your body's subtle signals and prioritize immune system health"
            },
            root: {
                name: "Root Center",
                function: "Pressure and stress to get things done",
                definedTraits: "Consistent pressure patterns, reliable stress responses, fixed drive to complete",
                undefinedTraits: "Open to all pressures, amplifies others' stress, wisdom about pressure and timing",
                definedGuidance: "Use your consistent pressure patterns to drive completion and productivity",
                undefinedGuidance: "Don't rush or let others' pressure stress you out. You're wise about timing",
                healthTips: "Manage stress through regular movement and completion of tasks"
            }
        };
        
        return centerData[centerName];
    }

    // Continuing with more detailed content generation methods...
    
    getLifePurpose() {
        const purposes = {
            'Generator': "Your life purpose is to master your craft and light up the world with your sustainable energy. You're here to build, create, and respond to life in ways that generate satisfaction for yourself and everyone around you.",
            'Manifestor': "Your life purpose is to initiate and pioneer new directions for humanity. You're here to start things, create impact, and lead others toward new possibilities.",
            'Projector': "Your life purpose is to guide others toward efficiency and success. You're here to optimize systems and help people use their energy more effectively.",
            'Reflector': "Your life purpose is to reflect the health of your community and provide deep wisdom about what's working and what isn't."
        };
        return purposes[this.type];
    }

    getMissionStatement() {
        return `As a ${this.type} with ${this.authority} authority, your mission is to ${this.getLifePurpose().toLowerCase()} while honoring your unique decision-making process and living according to your ${this.profile} profile theme.`;
    }

    // Additional methods would continue here for all the other content sections...
    // For brevity, I'm showing the structure and key methods

    getCareerOverview() {
        const overviews = {
            'Generator': "Your career should light you up and allow you to respond to opportunities that excite you. You have the sustainable energy to master your craft and build something lasting.",
            'Manifestor': "Your career should give you freedom to initiate and create impact. You work best when you can start things and move independently without micromanagement.",
            'Projector': "Your career should recognize your natural guidance abilities and invite your wisdom. You excel in roles where you can guide and optimize systems or people.",
            'Reflector': "Your career should allow you to reflect the health of organizations and communities. You excel in roles where you can observe, evaluate, and provide wisdom."
        };
        return overviews[this.type];
    }

    getRelationshipOverview() {
        return `As a ${this.type}, you bring unique gifts to relationships. Understanding your design helps you connect more authentically and avoid relationship patterns that don't serve you.`;
    }

    // Add many more content generation methods here...
    // This is a comprehensive framework that can be expanded

    getDailyAffirmations() {
        const affirmations = {
            'Generator': [
                "I trust my gut responses and follow what lights me up",
                "My energy is sustainable when I'm doing work I love",
                "I respond to life rather than pushing and forcing",
                "My satisfaction guides me toward my highest path"
            ],
            'Manifestor': [
                "I inform others and create with peace and flow",
                "My independence is a gift to the world",
                "I initiate from my authentic impulses",
                "I create impact through my unique vision"
            ],
            'Projector': [
                "I wait for genuine invitations that recognize my gifts",
                "My wisdom is valuable and worth waiting for the right recognition",
                "I guide others toward success and efficiency",
                "I trust that the right opportunities will find me"
            ],
            'Reflector': [
                "I trust my lunar timing and wait for clarity",
                "I reflect the health and wisdom of my community",
                "My unique perspective is valuable and needed",
                "I am surprised and delighted by life's possibilities"
            ]
        };
        return affirmations[this.type];
    }

    getNextSteps() {
        return [
            "Begin experimenting with your Strategy and Authority in daily decisions",
            "Observe your Type's Not-Self theme and course-correct when you notice it",
            "Start living according to your Profile's theme and life purpose",
            "Create a daily practice that honors your design",
            "Find others who understand and support your Human Design journey",
            "Continue studying and deepening your understanding of your unique design"
        ];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
} else {
    window.ReportGenerator = ReportGenerator;
}