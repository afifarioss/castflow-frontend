// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {AdRegistry} from "../src/AdRegistry.sol";

contract AdRegistryTest is Test {
    AdRegistry registry;

    address creator = address(0x1);
    address other = address(0x2);

    function setUp() public {
        registry = new AdRegistry();
    }

    function test_ListSlot_StoresCorrectData() public {
        vm.prank(creator);
        uint256 slotId = registry.listSlot(100, "Sponsored cast slot");

        AdRegistry.Slot memory slot = registry.getSlot(slotId);
        assertEq(slot.creator, creator);
        assertEq(slot.price, 100);
        assertEq(slot.description, "Sponsored cast slot");
        assertTrue(slot.active);
    }

    function test_ListSlot_IncrementsSlotId() public {
        vm.prank(creator);
        uint256 first = registry.listSlot(100, "First slot");

        vm.prank(creator);
        uint256 second = registry.listSlot(200, "Second slot");

        assertEq(first, 0);
        assertEq(second, 1);
    }

    function test_ListSlot_RevertsOnZeroPrice() public {
        vm.prank(creator);
        vm.expectRevert("Price must be > 0");
        registry.listSlot(0, "Free slot");
    }

    function test_DeactivateSlot_OwnerCanDeactivate() public {
        vm.prank(creator);
        uint256 slotId = registry.listSlot(100, "Slot to deactivate");

        vm.prank(creator);
        registry.deactivateSlot(slotId);

        AdRegistry.Slot memory slot = registry.getSlot(slotId);
        assertFalse(slot.active);
    }

    function test_DeactivateSlot_RevertsIfNotOwner() public {
        vm.prank(creator);
        uint256 slotId = registry.listSlot(100, "Slot");

        vm.prank(other);
        vm.expectRevert("Not slot owner");
        registry.deactivateSlot(slotId);
    }

    function test_DeactivateSlot_RevertsIfAlreadyInactive() public {
        vm.prank(creator);
        uint256 slotId = registry.listSlot(100, "Slot");

        vm.prank(creator);
        registry.deactivateSlot(slotId);

        vm.prank(creator);
        vm.expectRevert("Already inactive");
        registry.deactivateSlot(slotId);
    }

    function test_GetSlot_ReturnsEmptyForNonexistentSlot() public {
        AdRegistry.Slot memory slot = registry.getSlot(999);
        assertEq(slot.creator, address(0));
        assertEq(slot.price, 0);
    }

    function test_ListSlot_EmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit AdRegistry.SlotListed(0, creator, 100, "Event test slot");
        vm.prank(creator);
        registry.listSlot(100, "Event test slot");
    }
}
