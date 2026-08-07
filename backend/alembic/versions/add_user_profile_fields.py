"""add_user_profile_fields

Revision ID: add_user_profile_fields
Revises: c4bd13a67629
Create Date: 2026-08-07 16:05:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_user_profile_fields'
down_revision = 'c4bd13a67629'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('display_name', sa.String(), nullable=True))
    op.add_column('users', sa.Column('semester', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('year', sa.Integer(), nullable=True))

def downgrade():
    op.drop_column('users', 'display_name')
    op.drop_column('users', 'semester')
    op.drop_column('users', 'year')
