"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var uuid_1 = require("uuid");
var prisma = new client_1.PrismaClient();
// Helper function to generate random time between two dates
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
// Helper function to create a clock-in/out pair
function generateClockInOut(userId, baseDate, isLongShift) {
    if (isLongShift === void 0) { isLongShift = false; }
    var clockInTime = new Date(baseDate);
    clockInTime.setHours(8 + Math.floor(Math.random() * 3)); // Start between 8-10 AM
    clockInTime.setMinutes(Math.floor(Math.random() * 60));
    var clockOutTime = new Date(clockInTime);
    var shiftLength = isLongShift ? 10 + Math.random() * 4 : 6 + Math.random() * 4; // 10-14 hours or 6-10 hours
    clockOutTime.setHours(clockOutTime.getHours() + Math.floor(shiftLength));
    clockOutTime.setMinutes(Math.floor(Math.random() * 60));
    return {
        id: (0, uuid_1.v4)(),
        userId: userId,
        clockInTime: clockInTime,
        clockOutTime: clockOutTime,
        createdAt: clockInTime,
        updatedAt: clockOutTime,
    };
}
function seedDemoData() {
    return __awaiter(this, void 0, void 0, function () {
        var demoUsers, users, clockInRecords, today, sevenDaysAgo, _i, users_1, user, currentDate, isLongShift, secondShift, activeUsers, _a, activeUsers_1, user, activeClockIn, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 8]);
                    // Clear existing data
                    console.log('Clearing existing data...');
                    return [4 /*yield*/, prisma.clockIn.deleteMany()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 2:
                    _b.sent();
                    // Create demo users
                    console.log('Creating demo users...');
                    demoUsers = [
                        {
                            id: (0, uuid_1.v4)(),
                            name: 'Sarah Johnson',
                            email: 'sarah.j@healthcare.demo',
                            auth0Id: 'demo|' + (0, uuid_1.v4)(),
                            role: 'CARE_WORKER',
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            name: 'Michael Chen',
                            email: 'michael.c@healthcare.demo',
                            auth0Id: 'demo|' + (0, uuid_1.v4)(),
                            role: 'CARE_WORKER',
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            name: 'Emily Rodriguez',
                            email: 'emily.r@healthcare.demo',
                            auth0Id: 'demo|' + (0, uuid_1.v4)(),
                            role: 'CARE_WORKER',
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            name: 'David Kim',
                            email: 'david.k@healthcare.demo',
                            auth0Id: 'demo|' + (0, uuid_1.v4)(),
                            role: 'CARE_WORKER',
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            name: 'Lisa Patel',
                            email: 'lisa.p@healthcare.demo',
                            auth0Id: 'demo|' + (0, uuid_1.v4)(),
                            role: 'CARE_WORKER',
                        },
                    ];
                    return [4 /*yield*/, Promise.all(demoUsers.map(function (user) {
                            return prisma.user.create({
                                data: __assign(__assign({}, user), { createdAt: new Date(), updatedAt: new Date() }),
                            });
                        }))];
                case 3:
                    users = _b.sent();
                    console.log('Creating clock-in records...');
                    clockInRecords = [];
                    today = new Date();
                    sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
                    // Generate clock-in records for the past 7 days
                    for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                        user = users_1[_i];
                        currentDate = new Date(sevenDaysAgo);
                        while (currentDate <= today) {
                            // 80% chance of working on any given day
                            if (Math.random() < 0.8) {
                                isLongShift = Math.random() < 0.3;
                                clockInRecords.push(generateClockInOut(user.id, currentDate, isLongShift));
                                // 20% chance of a second shift
                                if (Math.random() < 0.2) {
                                    secondShift = generateClockInOut(user.id, currentDate, false);
                                    secondShift.clockInTime.setHours(secondShift.clockInTime.getHours() + 8);
                                    secondShift.clockOutTime.setHours(secondShift.clockOutTime.getHours() + 8);
                                    clockInRecords.push(secondShift);
                                }
                            }
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                    }
                    activeUsers = users.slice(0, 2);
                    for (_a = 0, activeUsers_1 = activeUsers; _a < activeUsers_1.length; _a++) {
                        user = activeUsers_1[_a];
                        activeClockIn = {
                            id: (0, uuid_1.v4)(),
                            userId: user.id,
                            clockInTime: new Date(today.setHours(today.getHours() - 2)), // Clocked in 2 hours ago
                            clockOutTime: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        clockInRecords.push(activeClockIn);
                    }
                    return [4 /*yield*/, prisma.clockIn.createMany({
                            data: clockInRecords,
                        })];
                case 4:
                    _b.sent();
                    console.log('Demo data seeded successfully!');
                    console.log("Created ".concat(users.length, " users"));
                    console.log("Created ".concat(clockInRecords.length, " clock-in records"));
                    return [3 /*break*/, 8];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error seeding demo data:', error_1);
                    throw error_1;
                case 6: return [4 /*yield*/, prisma.$disconnect()];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the seeding
seedDemoData()
    .catch(function (error) {
    console.error(error);
    process.exit(1);
});
