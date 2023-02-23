import django.db.models.fields
from django.core.exceptions import ValidationError
from django.test import TestCase, TransactionTestCase
from .models import Goal
from django.db import transaction


class Settings(TransactionTestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Создаём тестовую запись Goal
        with transaction.atomic():
            cls.Goal = Goal.objects.create(
                owner_id=1,
                name="Objective",
                description="This objective is secure",
                block="Подбр",
                quarter="1",
                weight=20,
                current=True,
                planned=False,
            )

    @classmethod
    def tearDown(self):
        with transaction.atomic():
            super().tearDownClass()


class GoalModelTests(Settings):
    def test_owner_id(self):
        self.assertEqual(self.Goal.owner_id, 1)

    def test_name(self):
        self.assertEqual(self.Goal.name, "Objective")

    def test_description_type(self):
        self.assertEqual(self.Goal._meta.get_field("description").verbose_name, "Подробности")

#    def test_block_switchcase(self):
#        self.assertEqual(self.Goal._meta.get_field("block"), "")

#    def test_quarter(self):
#        self.assertEqual()

    def test_weight_lower(self):
        weight_invalid = Goal(weight=-1)
        with self.assertRaises(ValidationError):
            weight_invalid.full_clean()
            weight_invalid.save()

    def test_weight_higher(self):
        weight_invalid = Goal(weight=101)
        with self.assertRaises(ValidationError):
            weight_invalid.full_clean()
            weight_invalid.save()